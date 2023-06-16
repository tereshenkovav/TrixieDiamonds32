if NOT "%~1" == "" goto mainproc

echo "Argument - lang code" 
exit

:mainproc

rm -f TrixieDiamonds32-%2-1.0.0-Win32.zip
7z a -mx9 TrixieDiamonds32-%2-1.0.0-Win32.zip ..\bin
7z a -mx9 TrixieDiamonds32-%2-1.0.0-Win32.zip ..\data

SET TMPDIR=%TEMP%\HJD1xf612ZYg4
mkdir %TMPDIR%\bin
copy %QTDIR%\libgcc_s_dw2-1.dll  %TEMP%\HJD1xf612ZYg4\bin
copy "%QTDIR%\libstdc++-6.dll"   %TEMP%\HJD1xf612ZYg4\bin
copy %QTDIR%\libwinpthread-1.dll %TEMP%\HJD1xf612ZYg4\bin
copy %QTDIR%\Qt5Core.dll         %TEMP%\HJD1xf612ZYg4\bin
copy %QTDIR%\Qt5Script.dll       %TEMP%\HJD1xf612ZYg4\bin
mkdir %TMPDIR%\data
echo "%1" > %TMPDIR%\data\deflang.json

7z a -mx9 TrixieDiamonds32-%2-1.0.0-Win32.zip %TMPDIR%\bin
7z a -mx9 TrixieDiamonds32-%2-1.0.0-Win32.zip %TMPDIR%\data
