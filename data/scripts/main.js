var intro ;
var strings ;
var text ;
var stage ;

function loadLangResources() {

   strings = system.loadObject("strings.json") ;
   game.setGameTitle(strings.gametitle) ;
       
   text = game.loadText("arial.ttf",strings.textnext,24) ;
   text.setColor(200,200,200) ;
}

function Init() {    
   // Lang settings
   if (system.getCurrentLanguage()=="") {
     var langs = system.loadObject("languages.json") ;
     var deflang = system.loadObject("deflang.json") ;
     system.setUsedLanguages(langs) ;
     if (deflang!=null) system.setCurrentLanguage(deflang) ;
   }

   loadLangResources() ;

   game.setBackgroundColor(0,0,0) ;

   stage = 0 ;
   intro = game.loadSpritePCX8bit('intro.pcx') ;
   intro.setSmooth(false) ;
   intro.setScaleX(250) ;
   intro.setScaleY(300) ;

   return true ;
}

function Render() {
   intro.setAlpha(stage) ;
   intro.renderTo(400,300) ;

   if (stage>=255) text.printTo(600,550) ;

   return true ;
}

function Frame(dt) {
   if (game.isOneOfKeysDown([KEY_ESCAPE,KEY_SPACE,KEY_ENTER])) 
     game.goToScript("menu",null) ;

   if (stage<255) {
     stage+=100*dt ;
     if (stage>255) stage=255 ;
   }

   return true ;
}