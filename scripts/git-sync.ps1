param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("sync-start", "sync-end", "switch-pc-push", "switch-pc-pull")]
    [string]$Action,

    [string]$Branch,

    [object]$Message = "WIP: safe checkpoint",

    [switch]$InstallDeps
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command,
        [string[]]$Arguments = @()
    )

    $display = if ($Arguments.Count -gt 0) {
        "$Command $($Arguments -join ' ')"
    }
    else {
        $Command
    }

    Write-Host "> $display" -ForegroundColor Cyan
    & $Command @Arguments
}

function Ensure-GitRepository {
    $insideRepo = git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0 -or $insideRepo -ne "true") {
        throw "Run this script inside a Git repository."
    }
}

function Get-CurrentBranch {
    return (git branch --show-current).Trim()
}

function Get-UpstreamBranch {
    $upstream = git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null
    if ($LASTEXITCODE -eq 0) {
        return $upstream.Trim()
    }
    return ""
}

function Commit-IfNeeded {
    param(
        [Parameter(Mandatory = $true)]
        [string]$CommitMessage
    )

    $changes = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($changes)) {
        Write-Host "No local changes to commit." -ForegroundColor Yellow
        return
    }

    Invoke-Step -Command "git" -Arguments @("add", "-A")
    Invoke-Step -Command "git" -Arguments @("commit", "-m", $CommitMessage)
}

function Get-NormalizedMessage {
    if ($null -eq $Message) {
        return "WIP: safe checkpoint"
    }

    if ($Message -is [System.Array]) {
        $joined = ($Message | ForEach-Object { [string]$_ }) -join " "
        return $joined.Trim().TrimEnd("\\")
    }

    return ([string]$Message).Trim().TrimEnd("\\")
}

Ensure-GitRepository
$normalizedMessage = Get-NormalizedMessage

switch ($Action) {
    "sync-start" {
        Invoke-Step -Command "git" -Arguments @("checkout", "main")
        Invoke-Step -Command "git" -Arguments @("pull", "--rebase", "origin", "main")

        if ($InstallDeps) {
            Invoke-Step -Command "npm" -Arguments @("install")
        }

        Write-Host "Sync start completed." -ForegroundColor Green
    }

    "sync-end" {
        Commit-IfNeeded -CommitMessage $normalizedMessage

        $currentBranch = Get-CurrentBranch
        $upstream = Get-UpstreamBranch

        if ([string]::IsNullOrWhiteSpace($upstream)) {
            Invoke-Step -Command "git" -Arguments @("push", "-u", "origin", $currentBranch)
        }
        else {
            Invoke-Step -Command "git" -Arguments @("push")
        }

        Write-Host "Sync end completed." -ForegroundColor Green
    }

    "switch-pc-push" {
        Commit-IfNeeded -CommitMessage $normalizedMessage

        $currentBranch = Get-CurrentBranch
        $upstream = Get-UpstreamBranch

        if ([string]::IsNullOrWhiteSpace($upstream)) {
            Invoke-Step -Command "git" -Arguments @("push", "-u", "origin", $currentBranch)
        }
        else {
            Invoke-Step -Command "git" -Arguments @("push")
        }

        Write-Host "Safe checkpoint pushed. You can switch PCs now." -ForegroundColor Green
    }

    "switch-pc-pull" {
        if ([string]::IsNullOrWhiteSpace($Branch)) {
            throw "-Branch is required for switch-pc-pull. Example: -Branch feature/my-task"
        }

        Invoke-Step -Command "git" -Arguments @("fetch", "origin")
        Invoke-Step -Command "git" -Arguments @("checkout", $Branch)
        Invoke-Step -Command "git" -Arguments @("pull", "--rebase", "origin", $Branch)

        if ($InstallDeps) {
            Invoke-Step -Command "npm" -Arguments @("install")
        }

        Write-Host "Branch synced on this PC." -ForegroundColor Green
    }
}
