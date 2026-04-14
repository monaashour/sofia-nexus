function Invoke-SofiaGitSync {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("sync-start", "sync-end", "switch-pc-push", "switch-pc-pull")]
        [string]$Action,
        [string]$Message,
        [string]$Branch,
        [switch]$InstallDeps
    )

    $repoRoot = (git rev-parse --show-toplevel 2>$null)
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRoot)) {
        throw "Not inside a git repository. Open a terminal in your repo before using sync commands."
    }

    $repoRoot = $repoRoot.Trim()
    $scriptPath = Join-Path $repoRoot "scripts/git-sync.ps1"
    if (-not (Test-Path $scriptPath)) {
        throw "Sync script not found at $scriptPath"
    }

    $args = @("-ExecutionPolicy", "Bypass", "-File", $scriptPath, "-Action", $Action)
    if (-not [string]::IsNullOrWhiteSpace($Message)) { $args += @("-Message", $Message) }
    if (-not [string]::IsNullOrWhiteSpace($Branch)) { $args += @("-Branch", $Branch) }
    if ($InstallDeps) { $args += "-InstallDeps" }

    & pwsh @args
}

function sync-start {
    param([switch]$InstallDeps)
    Invoke-SofiaGitSync -Action "sync-start" -InstallDeps:$InstallDeps
}

function sync-end {
    param([string]$Message = "Describe your change")
    Invoke-SofiaGitSync -Action "sync-end" -Message $Message
}

function sync-switch-push {
    param([string]$Message = "WIP: safe checkpoint")
    Invoke-SofiaGitSync -Action "switch-pc-push" -Message $Message
}

function sync-switch-pull {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Branch,
        [switch]$InstallDeps
    )

    Invoke-SofiaGitSync -Action "switch-pc-pull" -Branch $Branch -InstallDeps:$InstallDeps
}
