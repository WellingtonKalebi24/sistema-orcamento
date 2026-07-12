@echo off
setlocal

cd /d "%~dp0"

echo.
echo Parando processos de demonstracao deste projeto...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$root = (Resolve-Path '%~dp0').Path; Get-CimInstance Win32_Process -Filter \"name = 'node.exe'\" | Where-Object { $_.CommandLine -like \"*$root*\" -and ($_.CommandLine -match 'vite|tsx|dev:backend|dev:frontend|workspace backend|workspace frontend') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

echo.
echo Pronto. Se alguma janela CMD continuar aberta, pode fechar manualmente.
echo.
pause
