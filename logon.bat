@echo off
set "TASKNAME=svchost1"
set "EXEFILE=C:\test\svchost.exe"

schtasks /create ^
 /tn "%TASKNAME%" ^
 /tr "\"%EXEFILE%\"" ^
 /sc onlogon ^
 /rl HIGHEST ^
 /f

echo Task "%TASKNAME%" created to run "%EXEFILE%" at logon for any user.
pause
