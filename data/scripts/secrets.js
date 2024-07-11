var strings ;
var text_about ;
var text_title ;
var rects_help = new Array();
var profile ;
var text_secret0 ;
var text_secret1 ;
var text_secret2 ;
var ok ;
var deny ;

$include<rects.inc>
$include<funcs.inc>
$include<profile.inc>

function Init() {    

   profile = loadProfile() ;

   strings = system.loadObject("strings.json") ;
   game.setBackgroundColor(0,0,0) ;
   
   ok = game.loadSpritePCX8bit('ok.pcx',true) ;
   ok.setSmooth(false) ;
   ok.setScale(200,200) ;

   deny = game.loadSpritePCX8bit('deny.pcx',true) ;
   deny.setSmooth(false) ;
   deny.setScale(200,200) ;

   text_about = game.loadPixelText("font.8x8","",2) ;
   text_about.setColor(200,200,200) ;

   text_title = game.loadPixelText("font.8x8","",2.5) ;
   text_title.setColor(200,200,200) ;
   text_title.setAlignCenter() ;

   var s = strings.text_secret+" 1: " ;
   if (profile.secret_0) s+=strings.secret_0 ; else s+=strings.secret_hidden ;
   text_secret0 = game.loadPixelText("font.8x8",s,1.75) ;
   text_secret0.setColor(200,200,200) ;

   s = strings.text_secret+" 2: " ;
   if (profile.secret_1) s+=strings.secret_1 ; else s+=strings.secret_hidden ;
   text_secret1 = game.loadPixelText("font.8x8",s,1.75) ;
   text_secret1.setColor(200,200,200) ;

   s = strings.text_secret+" 3: " ;
   if (profile.secret_2) s+=strings.secret_2 ; else s+=strings.secret_hidden ;
   text_secret2 = game.loadPixelText("font.8x8",s,1.75) ;
   text_secret2.setColor(200,200,200) ;

   rline = game.createRect(120,120,120) ;

   makeRects(rects_help) ;

   return true ;
}

function Render() {
   renderRects(rects_help,50,50,700,500) ;

   text_title.setText(strings.secret_title) ;
   text_title.printTo(400,100) ;   
   text_about.setText(strings.secret_about) ;
   text_about.printTo(100,160) ;

   if (profile.secret_0) ok.renderTo(100,260) ; else deny.renderTo(100,250) ;
   text_secret0.printTo(140,240) ;
   if (profile.secret_1) ok.renderTo(100,320) ; else deny.renderTo(100,320) ;
   text_secret1.printTo(140,300) ;
   if (profile.secret_2) ok.renderTo(100,380) ; else deny.renderTo(100,380) ;
   text_secret2.printTo(140,360) ;
   return true ;
}

function Frame(dt) {
   if (game.isOneOfKeysDown([KEY_ESCAPE,KEY_SPACE,KEY_ENTER])) game.goToScript("menu",null) ;

   return true ;
}