var trixie_wait ;
var rects_gameover = new Array();
var text_closeconfirm ;
var text_closeconfirm_buts ;

$include<rects.inc>

function Init(args) {
   strings = system.loadObject("strings.json") ;
   
   trixie_wait = game.loadSpritePCX8bit('trx_wait.pcx',true) ;
   trixie_wait.setSmooth(false) ;

   makeRects(rects_gameover) ;

   text_closeconfirm = game.loadText("arial.ttf",strings.textcloseconfirm,22) ;
   text_closeconfirm.setColor(200,200,200) ;
   text_closeconfirm_buts = game.loadText("arial.ttf",strings.textcloseconfirmbuts,16) ;
   text_closeconfirm_buts.setColor(180,180,180) ;

   return true ;
}
 
function Render() {
   renderRects(rects_gameover,250,220,300,160) ;
   trixie_wait.renderTo(310,300) ;
   text_closeconfirm.printTo(360,250) ;
   text_closeconfirm_buts.printTo(360,310) ;

   return true ;
}

function Frame(dt) {

   if (game.isKeyDown(KEY_ESCAPE)) game.goToScript("anyname",null) ;      

   if (game.isKeyDown(KEY_F10)) return false ;

   return true ;
}
