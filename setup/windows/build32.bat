SET QTDIR=C:\Qt\Qt5.14.1\5.14.1\mingw73_32\bin
"C:\Program Files (x86)\NSIS\makensis.exe" /DQTDIR=%QTDIR% /DGAMELANG=ru /DUPPERLANG=RU TrixieDiamonds32.nsi
"C:\Program Files (x86)\NSIS\makensis.exe" /DQTDIR=%QTDIR% /DGAMELANG=en /DUPPERLANG=EN TrixieDiamonds32.nsi

call create_zip32.bat ru RU
call create_zip32.bat en EN
