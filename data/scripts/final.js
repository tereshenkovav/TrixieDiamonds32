var logo ;
var strings ;
var text_final ;
var rects_final = new Array();

$include<rects.inc>

function Init() {    

   strings = system.loadObject("strings.json") ;  
   game.setBackgroundColor(0,0,0) ;

   logo = game.loadSprite('final.png') ;

   text_final = game.loadText("arial.ttf",strings.textfinal,28) ;
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