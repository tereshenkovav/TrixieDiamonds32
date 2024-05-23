var logo ;
var strings ;
var text_final ;
var rects_final = new Array();

$include<rects.inc>

function Init() {    

   strings = system.loadObject("strings.json") ;  
   game.setBackgroundColor(0,0,0) ;

   logo = game.loadAnimationPCX8bit('final.pcx',34,9,true) ;
   logo.setScale(200,200) ;
   logo.play() ;
   logo.setSmooth(false) ;

   text_final = game.loadText("fontover.otf",strings.textfinal,22) ;
   text_final.setColor(200,200,200) ;

   makeRects(rects_final) ;

   return true ;
}

function Render() {
   renderRects(rects_final,50,50,700,500) ;

   logo.renderTo(400,260) ;

   text_final.printTo(140,460) ;

   return true ;
}

function Frame(dt) {
   if (game.isOneOfKeysDown([KEY_ESCAPE,KEY_SPACE,KEY_ENTER]))
     game.goToScript("menu",null) ;

   return true ;
}