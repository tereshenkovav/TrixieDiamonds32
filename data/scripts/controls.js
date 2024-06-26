var selector ;
var strings ;
var rects_menu = new Array();
var snd_menu ;
var menu = new Array() ;
var profile ;
var editindex = -1 ;
var tekmenu = 0 ;

$include<rects.inc>
$include<profile.inc>
$include<funcs.inc>

function getkstr(key,n) {
  if (editindex==n) return "_" ; else return key2name(key) ;
}

function rebuildMenu() {
   menu = [] ;
   menu.push(game.loadText("fontover.otf",strings.key_left+":  "+getkstr(profile.key_left,0),14)) ;
   menu.push(game.loadText("fontover.otf",strings.key_right+":  "+getkstr(profile.key_right,1),14)) ;
   menu.push(game.loadText("fontover.otf",strings.key_teleportup+":  "+getkstr(profile.key_teleportup,2),14)) ;
   menu.push(game.loadText("fontover.otf",strings.key_teleportdown+":  "+getkstr(profile.key_teleportdown,3),14)) ;
   menu.push(game.loadText("fontover.otf",strings.key_stop+":  "+getkstr(profile.key_stop,4),14)) ;
   menu.push(game.loadText("fontover.otf",strings.key_fire+":  "+getkstr(profile.key_fire,5),14)) ;
   menu.push(game.loadText("fontover.otf",strings.key_shield+":  "+getkstr(profile.key_shield,6),14)) ;
   menu.push(game.loadText("fontover.otf",strings.key_jump+":  "+getkstr(profile.key_jump,7),14)) ;

   menu.push(game.loadText("fontover.otf",strings.menu_2menu,14)) ;
   for (var i=0; i<menu.length; i++)
     menu[i].setColor(200,200,200) ;

}

function setNewKey(newkey) {
   if (editindex==0) profile.key_left=newkey ;
   if (editindex==1) profile.key_right=newkey ;
   if (editindex==2) profile.key_teleportup=newkey ;
   if (editindex==3) profile.key_teleportdown=newkey ;
   if (editindex==4) profile.key_stop=newkey ;
   if (editindex==5) profile.key_fire=newkey ;
   if (editindex==6) profile.key_shield=newkey ;
   if (editindex==7) profile.key_jump=newkey ;
}

function Init() {    
   strings = system.loadObject("strings.json") ;

   profile = loadProfile() ;

   rebuildMenu() ;

   game.setBackgroundColor(0,0,0) ;

   selector = game.loadSpritePCX8bit('selector.pcx',true) ;
   selector.setSmooth(false) ;
   selector.setScale(200) ;

   snd_menu = game.loadSound("menu.wav") ;

   makeRects(rects_menu) ;

   return true ;
}

function Render() {
   renderRects(rects_menu,170,100,480,334) ;

   for (var i=0; i<menu.length; i++) {
     if (tekmenu==i) selector.renderTo(220,140+i*32) ;
     menu[i].printTo(260,130+i*32) ;
   }

   return true ;
}

function Frame(dt) {

   if (editindex==-1) {
   if (game.isKeyDown(KEY_DOWN)) 
     if (tekmenu<menu.length-1) {
       snd_menu.play() ;
       tekmenu++ ;
     }
   if (game.isKeyDown(KEY_UP)) 
     if (tekmenu>0) {
       snd_menu.play() ;
       tekmenu-- ;
     }

   if (game.isKeyDown(KEY_ENTER)) {
      if (tekmenu==8) game.goToScript("menu",null) ; else {
        editindex=tekmenu ;
        rebuildMenu() ;
      }
   }

   if (game.isKeyDown(KEY_ESCAPE)) game.goToScript("menu",null) ;
   }
   else {
     if (game.isKeyDown(KEY_ESCAPE)) editindex=-1 ; else
     var newkey = game.getKeyDown() ;
     if (newkey!=-1) {
       setNewKey(newkey) ;
       editindex=-1 ;
       rebuildMenu() ;
       saveProfile(profile) ;
     }
   }

   return true ;
}
