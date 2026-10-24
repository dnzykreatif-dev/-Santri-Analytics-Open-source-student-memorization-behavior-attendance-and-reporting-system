$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root "core-library"
$excluded = @("Config.gs", "Installation.gs", "ReleaseManagement.gs")

Get-ChildItem -LiteralPath $root -Filter "*.gs" -File |
  Where-Object { $excluded -notcontains $_.Name -and $_.Name -ne "CoreHost.gs" } |
  ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $target $_.Name) -Force
  }

Write-Output "Core library source prepared in $target"
