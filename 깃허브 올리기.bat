@echo off
chcp 65001 >nul
cd /d "%~dp0"
for /f %%d in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set D=%%d
echo [%D%] 문체위 사이트를 깃허브에 올립니다...
echo.
echo  * 예산 자료(dataudget.json)는 올리지 않습니다. (.gitignore)
echo.
git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo 바뀐 내용이 없습니다. 인터넷에 올라온 최신 내용만 받아옵니다.
  git pull --rebase
  goto end
)
git commit -m "chore: 문체위 의정지원 시스템 갱신 %D%"
if errorlevel 1 goto fail
git pull --rebase
if errorlevel 1 goto fail
git push
if errorlevel 1 goto fail
echo.
echo 완료했습니다. 1~2분 뒤 아래 주소에 반영됩니다.
echo   https://hy9510-collab.github.io/ggassembly-munche/
goto end

:fail
echo.
echo 올리지 못했습니다. 인터넷 연결과 깃허브 로그인을 확인해 주세요.

:end
if not "%1"=="auto" pause
