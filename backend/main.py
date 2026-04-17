from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import secrets
import smtplib
import sqlite3
import ssl
import string
import uuid
from email.message import EmailMessage

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load .env from the backend/ directory (works both locally and in production)
load_dotenv(Path(__file__).with_name(".env"))

DB_PATH = Path(os.getenv("SOFIA_DB_PATH", Path(__file__).with_name("sofia_nexus.db")))
UPLOADS_DIR = Path(__file__).with_name("uploads")
SESSION_TOKENS: dict[str, str] = {}


class CompanyInfo(BaseModel):
    name: str = Field(min_length=1)
    website: str = ""
    industry: str = Field(min_length=1)
    size: str = Field(min_length=1)
    country: str = ""


class ContactInfo(BaseModel):
    fullName: str = Field(min_length=1)
    workEmail: str = Field(min_length=1)
    phone: str = ""


class EnterpriseOnboardingRequest(BaseModel):
    profile: str = "enterprise_customer"
    submittedAt: str
    company: CompanyInfo
    goals: list[str] = []
    priority: str = ""
    expectations: str = ""
    documents: list[str] = []
    contact: ContactInfo


class EnterpriseOnboardingResponse(BaseModel):
    success: bool
    companyId: str
    emailSent: bool
    message: str


class LoginRequest(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)


class LoginResponse(BaseModel):
    success: bool
    companyId: str
    fullName: str
    mustChangePassword: bool
    token: str
    message: str


class ForceChangePasswordRequest(BaseModel):
    email: str = Field(min_length=1)
    currentPassword: str = Field(min_length=1)
    newPassword: str = Field(min_length=8)


class ForceChangePasswordResponse(BaseModel):
    success: bool
    message: str


class ForgotPasswordRequest(BaseModel):
    email: str = Field(min_length=1)


class ForgotPasswordResponse(BaseModel):
    success: bool
    emailSent: bool
    message: str


app = FastAPI(title="Sofia Nexus Backend", version="1.0.0")


def get_db_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_db_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS user_accounts (
                email TEXT PRIMARY KEY,
                company_id TEXT NOT NULL,
                company_name TEXT NOT NULL,
                full_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                must_change_password INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS onboarding_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id TEXT NOT NULL,
                email TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                email_sent INTEGER NOT NULL,
                email_message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.commit()


def generate_temporary_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "@#$%"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def create_password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        120000,
    ).hex()
    return f"{salt}${digest}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt, stored_digest = password_hash.split("$", 1)
    except ValueError:
        return False

    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        120000,
    ).hex()
    return secrets.compare_digest(digest, stored_digest)


def send_onboarding_credentials_email(
    recipient_email: str,
    recipient_name: str,
    company_name: str,
    company_id: str,
    temporary_password: str,
) -> tuple[bool, str]:
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_from_email = os.getenv("SMTP_FROM_EMAIL", smtp_username)
    smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    app_login_url = os.getenv("APP_LOGIN_URL", "http://localhost:5173/#/login")

    if not smtp_host or not smtp_username or not smtp_password or not smtp_from_email:
        return False, "SMTP settings are missing"

    message = EmailMessage()
    message["Subject"] = "Your Sofia Nexus account credentials"
    message["From"] = smtp_from_email
    message["To"] = recipient_email
    message.set_content(
        f"""Hello {recipient_name},

Your company onboarding is complete.

Company Name: {company_name}
Company ID: {company_id}
Login Email: {recipient_email}
Temporary Password: {temporary_password}

Login URL: {app_login_url}

Please sign in and change your password immediately.

Best regards,
Sofia Nexus Team
"""
    )

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            if smtp_use_tls:
                server.starttls(context=context)
            server.login(smtp_username, smtp_password)
            server.send_message(message)
        return True, "Credentials email sent"
    except Exception as error:  # pragma: no cover - environment specific
        return False, f"Email delivery failed: {error}"


def send_password_reset_email(
    recipient_email: str,
    recipient_name: str,
    company_name: str,
    company_id: str,
    temporary_password: str,
) -> tuple[bool, str]:
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_from_email = os.getenv("SMTP_FROM_EMAIL", smtp_username)
    smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    app_login_url = os.getenv("APP_LOGIN_URL", "http://localhost:5173/#/")

    if not smtp_host or not smtp_username or not smtp_password or not smtp_from_email:
        return False, "SMTP settings are missing"

    message = EmailMessage()
    message["Subject"] = "Sofia Nexus password reset"
    message["From"] = smtp_from_email
    message["To"] = recipient_email
    message.set_content(
        f"""Hello {recipient_name},

We received your password reset request.

Company Name: {company_name}
Company ID: {company_id}
Login Email: {recipient_email}
New Temporary Password: {temporary_password}

Login URL: {app_login_url}

Please sign in and change your password immediately.

Best regards,
Sofia Nexus Team
"""
    )

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            if smtp_use_tls:
                server.starttls(context=context)
            server.login(smtp_username, smtp_password)
            server.send_message(message)
        return True, "Reset email sent"
    except Exception as error:  # pragma: no cover - environment specific
        return False, f"Email delivery failed: {error}"


def upsert_user_account(
    email: str,
    company_id: str,
    company_name: str,
    full_name: str,
    password_hash: str,
) -> None:
    now = datetime.now(timezone.utc).isoformat()
    with get_db_connection() as connection:
        connection.execute(
            """
            INSERT INTO user_accounts (
                email, company_id, company_name, full_name, password_hash,
                must_change_password, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, 1, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                company_id = excluded.company_id,
                company_name = excluded.company_name,
                full_name = excluded.full_name,
                password_hash = excluded.password_hash,
                must_change_password = 1,
                updated_at = excluded.updated_at
            """,
            (email.lower(), company_id, company_name, full_name, password_hash, now, now),
        )
        connection.commit()


def store_submission(
    company_id: str,
    email: str,
    payload: EnterpriseOnboardingRequest,
    email_sent: bool,
    email_message: str,
) -> None:
    with get_db_connection() as connection:
        connection.execute(
            """
            INSERT INTO onboarding_submissions (
                company_id, email, payload_json, email_sent, email_message, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                company_id,
                email.lower(),
                json.dumps(payload.model_dump(), ensure_ascii=True),
                int(email_sent),
                email_message,
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        connection.commit()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


init_db()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


_ALLOWED_UPLOAD_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg"}
_MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB
_MAX_UPLOAD_FILES = 5


@app.post("/api/upload-documents")
async def upload_documents(files: list[UploadFile] = File(...)) -> dict:
    if len(files) > _MAX_UPLOAD_FILES:
        raise HTTPException(status_code=400, detail=f"Maximum {_MAX_UPLOAD_FILES} files per request.")

    UPLOADS_DIR.mkdir(exist_ok=True)
    saved = []
    for upload in files:
        ext = Path(upload.filename or "").suffix.lower()
        if ext not in _ALLOWED_UPLOAD_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"File type not allowed: {upload.filename}")

        content = await upload.read()
        if len(content) > _MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=400, detail=f"File too large: {upload.filename}")

        stored_name = f"{uuid.uuid4().hex}{ext}"
        (UPLOADS_DIR / stored_name).write_bytes(content)
        saved.append({"originalName": upload.filename, "storedName": stored_name})

    return {"success": True, "files": saved}


@app.post("/api/enterprise-onboarding", response_model=EnterpriseOnboardingResponse)
def enterprise_onboarding(payload: EnterpriseOnboardingRequest) -> EnterpriseOnboardingResponse:
    company_id = f"CO-{uuid.uuid4().hex[:8].upper()}"
    temporary_password = generate_temporary_password()
    password_hash = create_password_hash(temporary_password)

    upsert_user_account(
        email=payload.contact.workEmail,
        company_id=company_id,
        company_name=payload.company.name,
        full_name=payload.contact.fullName,
        password_hash=password_hash,
    )

    email_sent, email_message = send_onboarding_credentials_email(
        recipient_email=payload.contact.workEmail,
        recipient_name=payload.contact.fullName,
        company_name=payload.company.name,
        company_id=company_id,
        temporary_password=temporary_password,
    )

    store_submission(
        company_id=company_id,
        email=payload.contact.workEmail,
        payload=payload,
        email_sent=email_sent,
        email_message=email_message,
    )

    return EnterpriseOnboardingResponse(
        success=True,
        companyId=company_id,
        emailSent=email_sent,
        message=(
            "Enterprise onboarding received. Credentials email sent."
            if email_sent
            else f"Enterprise onboarding received, but credentials email was not sent ({email_message})."
        ),
    )


@app.post("/api/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    with get_db_connection() as connection:
        user = connection.execute(
            """
            SELECT email, company_id, full_name, password_hash, must_change_password
            FROM user_accounts
            WHERE email = ?
            """,
            (payload.email.lower(),),
        ).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = secrets.token_urlsafe(32)
    SESSION_TOKENS[token] = payload.email.lower()

    must_change_password = bool(user["must_change_password"])
    return LoginResponse(
        success=True,
        companyId=user["company_id"],
        fullName=user["full_name"],
        mustChangePassword=must_change_password,
        token=token,
        message=(
            "Login successful. Please change your password before continuing."
            if must_change_password
            else "Login successful"
        ),
    )


@app.post("/api/auth/force-change-password", response_model=ForceChangePasswordResponse)
def force_change_password(payload: ForceChangePasswordRequest) -> ForceChangePasswordResponse:
    with get_db_connection() as connection:
        user = connection.execute(
            """
            SELECT email, password_hash
            FROM user_accounts
            WHERE email = ?
            """,
            (payload.email.lower(),),
        ).fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="Account not found")

        if not verify_password(payload.currentPassword, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Current password is incorrect")

        if payload.currentPassword == payload.newPassword:
            raise HTTPException(status_code=400, detail="New password must be different")

        connection.execute(
            """
            UPDATE user_accounts
            SET password_hash = ?, must_change_password = 0, updated_at = ?
            WHERE email = ?
            """,
            (
                create_password_hash(payload.newPassword),
                datetime.now(timezone.utc).isoformat(),
                payload.email.lower(),
            ),
        )
        connection.commit()

    return ForceChangePasswordResponse(
        success=True,
        message="Password changed successfully",
    )


@app.post("/api/auth/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(payload: ForgotPasswordRequest) -> ForgotPasswordResponse:
    email_normalized = payload.email.lower().strip()
    generic_message = "If an account exists for this email, reset instructions were sent."

    with get_db_connection() as connection:
        user = connection.execute(
            """
            SELECT email, company_id, company_name, full_name
            FROM user_accounts
            WHERE email = ?
            """,
            (email_normalized,),
        ).fetchone()

        if not user:
            return ForgotPasswordResponse(
                success=True,
                emailSent=False,
                message=generic_message,
            )

        temporary_password = generate_temporary_password()
        connection.execute(
            """
            UPDATE user_accounts
            SET password_hash = ?, must_change_password = 1, updated_at = ?
            WHERE email = ?
            """,
            (
                create_password_hash(temporary_password),
                datetime.now(timezone.utc).isoformat(),
                email_normalized,
            ),
        )
        connection.commit()

    email_sent, email_message = send_password_reset_email(
        recipient_email=user["email"],
        recipient_name=user["full_name"],
        company_name=user["company_name"],
        company_id=user["company_id"],
        temporary_password=temporary_password,
    )

    return ForgotPasswordResponse(
        success=True,
        emailSent=email_sent,
        message=(
            generic_message
            if email_sent
            else f"{generic_message} ({email_message})"
        ),
    )
