$ErrorActionPreference = 'Stop'

$packageName = 'mdbub'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url = 'https://github.com/YOUR_USERNAME/mdbubbles/releases/download/v0.1.0/mdbub-windows.exe'

$packageArgs = @{
  packageName    = $packageName
  unzipLocation  = $toolsDir
  fileType       = 'exe'
  url            = $url
  softwareName   = 'mdbub*'
  checksum       = 'REPLACE_WITH_ACTUAL_CHECKSUM'
  checksumType   = 'sha256'
  silentArgs     = '/S'
  validExitCodes = @(0)
}

# Download and install
Install-ChocolateyPackage @packageArgs

# Create shim for the executable
$exePath = Join-Path $toolsDir 'mdbub-windows.exe'
Install-BinFile -Name 'mdbub' -Path $exePath
