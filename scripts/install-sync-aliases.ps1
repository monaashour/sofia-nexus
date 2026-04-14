param(
    [string]$ProfilePath = $PROFILE.CurrentUserCurrentHost,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$repoRoot = (git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRoot)) {
    throw "Run this installer from inside the repository."
}

$repoRoot = $repoRoot.Trim()
$snippetPath = Join-Path $repoRoot "scripts/sofia-sync-aliases.ps1"
if (-not (Test-Path $snippetPath)) {
    throw "Alias snippet not found at $snippetPath"
}

$profileDir = Split-Path $ProfilePath -Parent
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}
if (-not (Test-Path $ProfilePath)) {
    New-Item -ItemType File -Path $ProfilePath -Force | Out-Null
}

$startMarker = "# >>> sofia-nexus alias loader >>>"
$endMarker = "# <<< sofia-nexus alias loader <<<"
$loaderLine = ". `"$snippetPath`""
$block = @(
    $startMarker,
    $loaderLine,
    $endMarker
) -join "`r`n"

$existing = Get-Content $ProfilePath -Raw
if ($existing -match [regex]::Escape($startMarker)) {
    if (-not $Force) {
        Write-Host "Aliases already installed in profile. Use -Force to rewrite loader block." -ForegroundColor Yellow
        Write-Host "Profile: $ProfilePath"
        exit 0
    }

    $pattern = [regex]::Escape($startMarker) + ".*?" + [regex]::Escape($endMarker)
    $updated = [regex]::Replace($existing, $pattern, $block, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    Set-Content -Path $ProfilePath -Value $updated -NoNewline
    Write-Host "Alias loader block updated." -ForegroundColor Green
}
else {
    if (-not [string]::IsNullOrWhiteSpace($existing)) {
        Add-Content -Path $ProfilePath -Value "`r`n"
    }
    Add-Content -Path $ProfilePath -Value $block
    Write-Host "Alias loader block installed." -ForegroundColor Green
}

Write-Host "Profile updated: $ProfilePath"
Write-Host "Restart terminal or run: . `$PROFILE"
