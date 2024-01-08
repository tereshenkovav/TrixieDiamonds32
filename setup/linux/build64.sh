#!/bin/bash

for i in `git tag`; do BUILDTAG=$i; done

for i in `git rev-parse HEAD`; do BUILDCOMMIT=$i; done
BUILDCOMMIT=${BUILDCOMMIT:0:8}

for i in `git rev-parse --abbrev-ref HEAD`; do BUILDBRANCH=$i; done

echo $BUILDTAG $BUILDCOMMIT $BUILDBRANCH

VERSION=${BUILDTAG:1}

echo {  > ../../data/version.json
echo \"tag\":\"$BUILDTAG\", >> ../../data/version.json
echo \"commit\":\"$BUILDCOMMIT\", >> ../../data/version.json
echo \"branch\":\"$BUILDBRANCH\" >> ../../data/version.json
echo }  >> ../../data/version.json

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
appimagetool-x86_64.AppImage $appdir /tmp/TrixieDiamonds32-EN-$VERSION-x86_64.AppImage

echo "\"ru\"" > $appdir/usr/data/deflang.json
appimagetool-x86_64.AppImage $appdir /tmp/TrixieDiamonds32-RU-$VERSION-x86_64.AppImage
