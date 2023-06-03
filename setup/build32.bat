SET QTDIR=C:\Qt\Qt5.14.1\5.14.1\mingw73_32\bin
"C:\Program Files (x86)\NSIS\makensis.exe" /DQTDIR=%QTDIR% TrixieDiamonds32.nsi 

rm -f TrixieDiamonds32-1.0.0-Win32.zip
7z a -mx9 TrixieDiamonds32-1.0.0-Win32.zip ..\bin
7z a -mx9 TrixieDiamonds32-1.0.0-Win32.zip ..\data

SET TMPDIR=%TEMP%\HJD1xf612ZYg4
mkdir %TMPDIR%\bin
copy %QTDIR%\libgcc_s_dw2-1.dll  %TEMP%\HJD1xf612ZYg4\bin
copy %QTDIR%\libstdc++-6.dll     %TEMP%\HJD1xf612ZYg4\bin
copy %QTDIR%\libwinpthread-1.dll %TEMP%\HJD1xf612ZYg4\bin
copy %QTDIR%\Qt5Core.dll         %TEMP%\HJD1xf612ZYg4\bin
copy %QTDIR%\Qt5Script.dll       %TEMP%\HJD1xf612ZYg4\bin

7z a -mx9 TrixieDiamonds32-1.0.0-Win32.zip %TMPDIR%\bin
