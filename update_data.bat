@echo off
echo ===========================================
echo    Library Kiosk Database Updater
echo ===========================================
echo.
echo Make sure you have placed your new .tsv file in this folder.
echo.

"C:\Program Files\nodejs\node.exe" convert.js

echo.
echo Press any key to close this window...
pause >nul
