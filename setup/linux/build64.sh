#!/bin/bash

appdir=/tmp/TrixieDiamonds.AppDir

rm -rf $appdir

mkdir $appdir
cp appruns/AppRun-x86_64 $appdir/AppRun
chmod 777 $appdir/AppRun
cp ../../graphics/main.png $appdir/TrixieDiamonds.png
pushd $appdir
ln -s TrixieDiamonds.png .DirIcon
popd

cp TrixieDiamonds.desktop $appdir
mkdir $appdir/usr
mkdir $appdir/usr/bin
mkdir $appdir/usr/lib

cp /usr/lib64/libsfml* $appdir/usr/lib
cp /usr/lib64/libQt5Script.so* $appdir/usr/lib
cp /usr/lib64/libQt5Core.so* $appdir/usr/lib
cp /usr/lib64/libicui18n.so* $appdir/usr/lib
cp /usr/lib64/libicuuc.so* $appdir/usr/lib
cp /usr/lib64/libicudata.so* $appdir/usr/lib
cp /usr/lib64/libvorbis* $appdir/usr/lib
cp /usr/lib64/libopenal.so* $appdir/usr/lib
cp /usr/lib64/libatomic.so* $appdir/usr/lib
cp /usr/lib64/libGLU.so* $appdir/usr/lib
cp /usr/lib64/libogg.so* $appdir/usr/lib
cp /usr/lib64/libFLAC.so* $appdir/usr/lib

cp ../../bin/TrixieDiamonds $appdir/usr/bin
cp -r ../../data $appdir/usr

export ARCH=x86_64

echo "\"en\"" > $appdir/usr/data/deflang.json
appimagetool-x86_64.AppImage $appdir /tmp/TrixieDiamonds32-EN-1.1.0-x86_64.AppImage

echo "\"ru\"" > $appdir/usr/data/deflang.json
appimagetool-x86_64.AppImage $appdir /tmp/TrixieDiamonds32-RU-1.1.0-x86_64.AppImage
