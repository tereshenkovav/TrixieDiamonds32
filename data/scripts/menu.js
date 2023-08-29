var logo ;
var langico ;
var selector ;
var strings ;
var rects_menu = new Array();
var snd_menu ;
var menu = new Array() ;
var gnd ;
var trixie_walk ;
var monster ;
var scenestage ;
var scenepos ;

const MENU_ARCADE = 0 ;
const MENU_FREEPLAY = 1 ;
const MENU_DIFFICULT = 2 ;
const MENU_LANG = 3 ;
const MENU_SOUND = 4 ;
const MENU_HELP = 5 ;
const MENU_EXIT = 6 ;

var tekmenu = MENU_ARCADE ;

$include<rects.inc>

function getDiffucultText(code) {
   if (code==0) return strings.text_easy ;
   if (code==1) return strings.text_medi ;
   if (code==2) return strings.text_hard ;
   return "?" ;
}

function loadLangResources() {

   strings = system.loadObject("strings.json") ;
   game.setGameTitle(strings.gametitle) ;

   logo = game.loadSpritePCX8bit('logo.pcx',true) ;
   logo.setSmooth(false) ;
   logo.setScale(200) ;

   langico = game.loadSprite('lang.png') ;
   langico.setSmooth(false) ;

   menu = [] ;
   menu.push(game.loadText("arial.ttf",strings.menuarcade,20)) ;
   menu.push(game.loadText("arial.ttf",strings.menufreeplay,20)) ;
   menu.push(game.loadText("arial.ttf",strings.menudiff+": "+getDiffucultText(system.getDifficult()),20)) ;
   menu.push(game.loadText("arial.ttf",strings.menulang+": "+system.getCurrentLanguage().toUpperCase(),20)) ;
   menu.push(game.loadText("arial.ttf",strings.menusound+": "+(system.isSoundOn()?strings.text_on:strings.text_off),20)) ;
   menu.push(game.loadText("arial.ttf",strings.menuhelp,20)) ;
   menu.push(game.loadText("arial.ttf",strings.menuexit,20)) ;
   for (var i=0; i<menu.length; i++)
     menu[i].setColor(200,200,200) ;
}

function Init() {    
   loadLangResources() ;

   game.setBackgroundColor(0,0,0) ;

   gnd = game.loadSpritePCX8bit('gnd_mid.pcx',true) ;
   gnd.setSmooth(false) ;
   gnd.setHotSpot(0,0) ;

   trixie_walk = game.loadAnimationPCX8bit('trx_walk.pcx',11,9,true) ;
   trixie_walk.play() ;
   trixie_walk.setSmooth(false) ;

   monster = game.loadAnimationPCX8bit('m_1.pcx',6,6,true)
   monster.play() ;
   monster.setSmooth(false) ;
   monster.setScale(150,150) ;

   selector = game.loadSpritePCX8bit('selector.pcx',true) ;
   selector.setSmooth(false) ;
   selector.setScale(200) ;

   snd_menu = game.loadSound("menu.wav") ;

   makeRects(rects_menu) ;

   scenestage=0 ;
   scenepos = -200 ;

   return true ;
}

function Render() {
   logo.renderTo(400,100) ;

   renderRects(rects_menu,250,160,320,320) ;

   for (var i=0; i<menu.length; i++) {
     if (tekmenu==i) selector.renderTo(300,210+i*36) ;
     menu[i].printTo(340,200+i*36) ;
   }
   langico.renderTo(340+menu[MENU_LANG].getTextWidth()+30,200+MENU_LANG*36+12) ;

   if (scenestage==0) {
     trixie_walk.mirrorHorz(false) ;
     trixie_walk.renderTo(scenepos-200,560-trixie_walk.getHeight()/2+5) ;
     monster.mirrorHorz(false) ;
     monster.renderTo(scenepos,560-1.5*monster.getHeight()/2) ;
   }
   else {
     trixie_walk.mirrorHorz(true) ;
     trixie_walk.renderTo(scenepos-300,560-trixie_walk.getHeight()/2+5) ;
     monster.mirrorHorz(true) ;
     monster.renderTo(scenepos-100,560-1.5*monster.getHeight()/2) ;
     monster.renderTo(scenepos,560-1.5*monster.getHeight()/2) ;
     monster.renderTo(scenepos+100,560-1.5*monster.getHeight()/2) ;
   }

   for (var i=0; i<20; i++)
     gnd.renderTo(gnd.getWidth()*i,560) ;

   return true ;
}

function Frame(dt) {

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
      if (tekmenu==MENU_ARCADE) game.goToScript("levels",{level:0,mode:"arcade"}) ;
      if (tekmenu==MENU_FREEPLAY) game.goToScript("levels",{level:0,mode:"freeplay"}) ;
      if (tekmenu==MENU_DIFFICULT) {
        system.switchDifficult() ;
        menu[MENU_DIFFICULT].setText(strings.menudiff+": "+getDiffucultText(system.getDifficult()),20) ;
      }
      if (tekmenu==MENU_LANG) {
        system.switchCurrentLanguage() ;
        loadLangResources() ;
      }
      if (tekmenu==MENU_SOUND) { 
        system.setSoundOn(!system.isSoundOn()) ;
        menu[MENU_SOUND].setText(strings.menusound+": "+(system.isSoundOn()?strings.text_on:strings.text_off)) ;
      }
      if (tekmenu==MENU_HELP) game.goToScript("help",null) ;
      if (tekmenu==MENU_EXIT) return false ;
   }

   scenepos+=(scenestage==0?100:-100)*dt ;
   if (scenepos>1200) scenestage=1; 
   if (scenepos<-300) scenestage=0;

   return true ;
}