@echo off
for /F %%i in ('git tag --list --sort=committerdate') do set BUILDTAG=%%i
for /F %%i in ('git rev-parse HEAD') do set BUILDCOMMIT=%%i
set BUILDCOMMIT=%BUILDCOMMIT:~0,8%
for /F %%i in ('git branch --show-current') do set BUILDBRANCH=%%i

echo %BUILDTAG% %BUILDCOMMIT% %BUILDBRANCH%

echo {  > ..\..\data\version.json
echo "tag":"%BUILDTAG%", >> ..\..\data\version.json
echo "commit":"%BUILDCOMMIT%", >> ..\..\data\version.json
echo "branch":"%BUILDBRANCH%" >> ..\..\data\version.json
echo }  >> ..\..\data\version.json

SET VERSION=%BUILDTAG:~1%
SET QTDIR=C:\Qt\Qt5.14.1\5.14.1\mingw73_32\bin
"C:\Program Files (x86)\NSIS\makensis.exe" /DQTDIR=%QTDIR% /DVERSION=%VERSION% /DGAMELANG=ru /DUPPERLANG=RU TrixieDiamonds32.nsi
"C:\Program Files (x86)\NSIS\makensis.exe" /DQTDIR=%QTDIR% /DVERSION=%VERSION% /DGAMELANG=en /DUPPERLANG=EN TrixieDiamonds32.nsi

call create_zip32.bat ru RU
call create_zip32.bat en EN
