$ErrorActionPreference = 'Stop'

$packageName = 'mdbub'

# Remove the shim
Uninstall-BinFile -Name 'mdbub'

Write-Host "mdbub has been uninstalled."
