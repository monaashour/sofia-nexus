param(
    [string]$RepoUrl = "https://github.com/monaashour/sofia-nexus.git",
    [string]$DestinationPath = "$HOME/Dev/sofia-nexus",
    [string]$Branch = "main",
    [switch]$InstallDeps,
    [switch]$ForceAliasUpdate
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
    param([Parameter(Mandatory = $true)][string]$Command)
    Write-Host "> $Command" -ForegroundColor Cyan
    Invoke-Expression $Command
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is not installed. Install Git first: https://git-scm.com/download/win"
}

if ($InstallDeps -and -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm is not installed. Install Node.js LTS first: https://nodejs.org"
}

$resolvedDestination = [System.IO.Path]::GetFullPath($DestinationPath)
$parentDir = Split-Path $resolvedDestination -Parent
if (-not (Test-Path $parentDir)) {
    New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
}

if (Test-Path (Join-Path $resolvedDestination ".git")) {
    Write-Host "Existing repository detected. Updating local copy..." -ForegroundColor Yellow
    Push-Location $resolvedDestination
    try {
        Invoke-Step "git checkout $Branch"
        Invoke-Step "git pull --rebase origin $Branch"
    }
    finally {
        Pop-Location
    }
}
else {
    Invoke-Step "git clone --branch $Branch $RepoUrl `"$resolvedDestination`""
}

Push-Location $resolvedDestination
try {
    $installerArgs = @(
        "-ExecutionPolicy", "Bypass",
        "-File", ".\\scripts\\install-sync-aliases.ps1"
    )

    if ($ForceAliasUpdate) {
        $installerArgs += "-Force"
    }

    & pwsh @installerArgs

    if ($InstallDeps) {
        Invoke-Step "npm install"
    }

    Write-Host "Bootstrap completed." -ForegroundColor Green
    Write-Host "Next: restart terminal (or run '. `$PROFILE'), then use sync-start." -ForegroundColor Green
}
finally {
    Pop-Location
}
