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

const COLS = 5 ;

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
   for (var i=0; i<LEVEL_COUNT; i++) {
     menu[i].setAlignCenter() ;
     if (i<=nextlevel) 
       menu[i].setColor(200,200,200) ;
     else
       menu[i].setColor(70,70,70) ;
   }

   makeRects(rects_menu) ;

   return true ;
}

function Render() {
   logo.renderTo(400,100) ;

   renderRects(rects_menu,20,150,760,400) ;

   for (var i=0; i<LEVEL_COUNT; i++) {
     if (teklevel==i) 
       selector.renderTo(100+(i % COLS)*150,200+Math.floor(i/COLS)*180) ;
     menu[i].printTo(100+(i % COLS)*150,230+Math.floor(i/COLS)*180) ;
     minimap.renderMiniMap(100+(i % COLS)*150,300+Math.floor(i/COLS)*180,
       i,i>nextlevel) ;
   }

   return true ;
}

function Frame(dt) {
   if (game.isKeyDown(KEY_ESCAPE)) game.goToScript("menu",null) ;

   if (game.isKeyDown(KEY_RIGHT)) 
     if ((teklevel<menu.length-1)&&(teklevel<nextlevel)) {
       snd_menu.play() ;
       teklevel++ ;
     }
   if (game.isKeyDown(KEY_LEFT)) 
     if (teklevel>0) {
       snd_menu.play() ;
       teklevel-- ;
     }
   if (game.isKeyDown(KEY_DOWN)) 
     if ((teklevel+COLS-1<menu.length-1)&&(teklevel+COLS-1<nextlevel)) {
       snd_menu.play() ;
       teklevel+=COLS ;
     }
   if (game.isKeyDown(KEY_UP)) 
     if (teklevel>COLS-1) {
       snd_menu.play() ;
       teklevel-=COLS ;
     }

   if (game.isKeyDown(KEY_ENTER)) {
      game.goToScript("game",{level:teklevel,mode:tekmode}) ;
   }

   return true ;
}