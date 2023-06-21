var logo ;
var selector ;
var rects_menu = new Array();
var snd_menu ;
var menu = new Array() ;
var strings ;
var nextlevel ;
var teklevel ;
var tekmode ;

$include<rects.inc>
$include<consts.inc>

function Init(arg) {    
   teklevel = arg.level ;
   tekmode = arg.mode ;

   strings = system.loadObject("strings.json") ;  

   if (tekmode=="arcade") {
   var profile = system.loadObjectFromAppData("profile.json") ;
   if (profile==null) nextlevel=0 ; else nextlevel = profile.nextlevel ;
   }
   else 
     nextlevel=LEVEL_COUNT ;

   game.setBackgroundColor(0,0,0) ;

   logo = game.loadSpritePCX8bit('logo.pcx',true) ;
   logo.setSmooth(false) ;
   logo.setScale(200) ;

   selector = game.loadSpritePCX8bit('selector.pcx',true) ;
   selector.setSmooth(false) ;
   selector.setScale(200) ;

   snd_menu = game.loadSound("menu.wav") ;
   
   for (var i=0; i<LEVEL_COUNT; i++)
     menu.push(game.loadText("arial.ttf",strings.levelhead+" "+(i+1),20)) ;
   for (var i=0; i<LEVEL_COUNT; i++)
     if (i<=nextlevel) 
       menu[i].setColor(200,200,200) ;
     else
       menu[i].setColor(70,70,70) ;

   makeRects(rects_menu) ;

   return true ;
}

function Render() {
   logo.renderTo(400,100) ;

   renderRects(rects_menu,250,160,300,420) ;

   for (var i=0; i<menu.length; i++) {
     if (teklevel==i) selector.renderTo(300,210+i*35) ;
     menu[i].printTo(340,200+i*35) ;
   }

   return true ;
}

function Frame(dt) {
   if (game.isKeyDown(KEY_ESCAPE)) game.goToScript("menu",null) ;

   if (game.isKeyDown(KEY_DOWN)) 
     if ((teklevel<menu.length-1)&&(teklevel<nextlevel)) {
       snd_menu.play() ;
       teklevel++ ;
     }
   if (game.isKeyDown(KEY_UP)) 
     if (teklevel>0) {
       snd_menu.play() ;
       teklevel-- ;
     }

   if (game.isKeyDown(KEY_ENTER)) {
      game.goToScript("game",{level:teklevel,mode:tekmode}) ;
   }

   return true ;
}