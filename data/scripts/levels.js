var logo ;
var selector ;
var rects_menu = new Array();
var snd_menu ;
var menu = new Array() ;
var strings ;
var nextlevel ;
var teklevel ;
var tekmode ;
var profile ;
var stars = new Array();
var star_no ;

$include<rects.inc>
$include<consts.inc>
$include<profile.inc>

const COLS = 5 ;

function Init(arg) {    
   teklevel = arg.level ;
   tekmode = arg.mode ;

   strings = system.loadObject("strings.json") ;  

   profile = loadProfile() ;
   if (tekmode=="arcade")
     nextlevel=profile.nextlevel ;
   else 
     nextlevel=LEVEL_COUNT ;

   game.setBackgroundColor(0,0,0) ;

   logo = game.loadSpritePCX8bit('logo.pcx',true) ;
   logo.setSmooth(false) ;
   logo.setScale(200) ;

   selector = game.loadSpritePCX8bit('selector.pcx',true) ;
   selector.setSmooth(false) ;
   selector.setScale(200) ;

   star_no = game.loadSprite('star_no.png') ;
   stars.push(game.loadSprite('star_easy.png')) ;
   stars.push(game.loadSprite('star_norm.png')) ;
   stars.push(game.loadSprite('star_hard.png')) ;

   snd_menu = game.loadSound("menu.wav") ;
   
   for (var i=0; i<LEVEL_COUNT; i++)
     menu.push(game.loadText("fontover.otf",strings.levelhead+" "+(i+1),14)) ;
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

   renderRects(rects_menu,20,150,760,430) ;

   var H = 200 ;

   for (var i=0; i<LEVEL_COUNT; i++) {
     if (teklevel==i) 
       selector.renderTo(100+(i % COLS)*150,190+Math.floor(i/COLS)*H) ;
     menu[i].printTo(100+(i % COLS)*150,210+Math.floor(i/COLS)*H) ;
     minimap.renderMiniMap(100+(i % COLS)*150,280+Math.floor(i/COLS)*H,
       i,i>nextlevel) ;

     if (tekmode=="arcade")
       for (var j=0; j<3; j++) {
         var star = (getLevelsByDifficultN(profile,j).indexOf(i)!=-1)?stars[j]:star_no ;
         star.renderTo(100+(i % COLS)*150+34*(j-1),336+Math.floor(i/COLS)*H) ;
       }
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