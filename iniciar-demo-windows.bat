@echo off
setlocal

cd /d "%~dp0"

echo.
echo ===============================================
echo  Sistema de Orcamentos - Demonstracao
echo ===============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado.
  echo Instale o Node.js 22 ou superior antes de iniciar.
  echo Download: https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm nao encontrado. Verifique a instalacao do Node.js.
  pause
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" (
    copy ".env.example" ".env" >nul
    echo Arquivo .env criado a partir do .env.example.
  )
)

if not exist "backend\.env" (
  if exist ".env" (
    copy ".env" "backend\.env" >nul
  )
)

set DEMO_MODE=true
set USE_MEMORY_DB=true

if not exist "node_modules" (
  echo Instalando dependencias. Isso pode demorar alguns minutos na primeira vez...
  call npm install
  if errorlevel 1 (
    echo.
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)

if not exist ".logs" mkdir ".logs"

echo.
echo Iniciando API em http://localhost:3333 ...
start "Sistema Orcamento - API" cmd /k "cd /d ""%CD%"" && npm run dev:backend"

echo Aguardando a API subir...
timeout /t 10 /nobreak >nul

echo Iniciando frontend em http://localhost:5173 ...
start "Sistema Orcamento - Web" cmd /k "cd /d ""%CD%"" && npm run dev:frontend"

echo Aguardando o frontend subir...
timeout /t 8 /nobreak >nul

start "" "http://localhost:5173/login"

echo.
echo Sistema iniciado.
echo Login de demonstracao:
echo   E-mail: admin@sistema.local
echo   Senha:  Admin@12345
echo.
echo Para parar o sistema, execute parar-demo-windows.bat.
echo.
pause
