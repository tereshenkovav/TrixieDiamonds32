var strings ;
var text_helppage ;
var text_helpinfo ;
var text_help ;
var text_title ;
var rects_help = new Array();
var trixie_wait ;
var star ;
var tekpage ;
var rline ;
var spr_bonus ;
var spr_heart ;
var spr_mana ;
var spr_bonus_gray ;
var spr_heart_gray ;
var spr_mana_gray ;
var monsterspr = new Array() ;

const PAGE_COUNT=5 ;

$include<rects.inc>
$include<funcs.inc>

function Init() {    

   strings = system.loadObject("strings.json") ;
   game.setBackgroundColor(0,0,0) ;

   star = game.loadSpritePCX8bit('star.pcx',true) ;
   star.setSmooth(false) ;
   star.setScale(300) ;
   star.mirrorHorz(true) ;

   //[!] start dub
   trixie_wait = game.loadSpritePCX8bit('trx_wait.pcx',true) ;
   trixie_wait.setSmooth(false) ;
   trixie_wait.setScale(300) ;

   spr_bonus = game.loadSpritePCX8bit('bonus.pcx',true) ;
   spr_bonus.setSmooth(false) ;
   spr_bonus.setScale(200,200) ;

   spr_heart = game.loadSpritePCX8bit('heart.pcx',true) ;
   spr_heart.setSmooth(false) ;
   spr_heart.setScale(200,200) ;

   spr_heart_gray = game.loadSpritePCX8bit('heart.pcx',true) ;
   spr_heart_gray.setSmooth(false) ;
   spr_heart_gray.setScale(200,200) ;
   spr_heart_gray.convertPixels("funcGray") ;

   spr_mana = game.loadSpritePCX8bit('mana.pcx',true) ;
   spr_mana.setSmooth(false) ;
   spr_mana.setScale(200,200) ;

   spr_mana_gray = game.loadSpritePCX8bit('mana.pcx',true) ;
   spr_mana_gray.setSmooth(false) ;
   spr_mana_gray.setScale(200,200) ;
   spr_mana_gray.convertPixels("funcGray") ;

   monsterspr.push(game.loadAnimationPCX8bit('m_1.pcx',6,6,true)) ;
   monsterspr.push(game.loadAnimationPCX8bit('m_2.pcx',6,6,true)) ;
   monsterspr.push(game.loadAnimationPCX8bit('m_3.pcx',4,6,true)) ;
   monsterspr.push(game.loadAnimationPCX8bit('m_4.pcx',5,6,true)) ;
   monsterspr.push(game.loadAnimationPCX8bit('m_5.pcx',6,6,true)) ;
   
   for (var i=0; i<monsterspr.length; i++) {
     monsterspr[i].setSmooth(false) ;
     monsterspr[i].setScale(150,150) ;
     monsterspr[i].play() ;
   }
   // end dub

   text_helppage = game.loadText("arial.ttf","",20) ;
   text_helppage.setColor(160,160,160) ;
   text_helppage.setAlignCenter() ;
   text_helpinfo = game.loadText("arial.ttf",strings.helpinfo,20) ;
   text_helpinfo.setColor(160,160,160) ;
   text_helpinfo.setAlignCenter() ;
   text_help = game.loadText("arial.ttf","",24) ;
   text_help.setColor(200,200,200) ;
   text_title = game.loadText("arial.ttf","",24) ;
   text_title.setColor(200,200,200) ;
   text_title.setAlignCenter() ;

   rline = game.createRect(120,120,120) ;

   makeRects(rects_help) ;
   tekpage=0 ;

   return true ;
}

function Render() {
   renderRects(rects_help,50,50,700,500) ;

   if (tekpage==0) {
      trixie_wait.renderTo(180,250) ;
      text_title.setText(strings.help1_1) ;
      text_title.printTo(400,140) ;
      text_help.setText(strings.help1_2) ;
      text_help.printTo(300,190) ;
      text_help.setText(strings.help1_3) ;
      text_help.printTo(100,380) ;
   }
   if (tekpage==1) {
      star.renderTo(580,240) ;
      text_help.setText(strings.help2_1) ;
      text_help.printTo(100,140) ;
      text_help.setText(strings.help2_2) ;
      text_help.printTo(100,350) ;
      text_help.setText(strings.help2_3) ;
      text_help.printTo(100,390) ;
      text_help.setText(strings.help2_4) ;
      text_help.printTo(100,430) ;
   }
   if (tekpage==2) {
      text_title.setText(strings.help3_1) ;
      text_title.printTo(400,140) ;
      
      spr_bonus.renderTo(590,200) ;
      spr_bonus.renderTo(630,200) ;
      spr_bonus.renderTo(670,200) ;
      spr_bonus.renderTo(610,220) ;
      spr_bonus.renderTo(650,220) ;

      text_help.setText(strings.help3_2) ;
      text_help.printTo(110,190) ;

      for (var i=0; i<monsterspr.length; i++) 
        monsterspr[i].renderTo(130+120*i,350) ;

      text_help.setText(strings.help3_3) ;
      text_help.printTo(110,390) ;

      spr_heart.renderTo(350,450) ;
      spr_heart.renderTo(400,450) ;
      spr_heart_gray.renderTo(450,450) ;
   }
   if (tekpage==3) {
      text_title.setText(strings.help4_1) ;
      text_title.printTo(400,140) ;

      text_help.setText(strings.help4_2) ;
      text_help.printTo(100,190) ;

      for (var i=0; i<8; i++)     
       ((i<3)?spr_mana:spr_mana_gray).renderTo(300+i*(2*spr_mana.getWidth()+5),420) ;
   }
   if (tekpage==4) {
      text_title.setText(strings.help5_1) ;
      text_title.printTo(400,140) ;

      text_help.setText(strings.help5_2) ;
      text_help.printTo(100,190) ;
   }

   text_helppage.setText(strings.helppage+" "+(tekpage+1)+" / "+PAGE_COUNT) ;
   text_helppage.printTo(400,70) ;

   text_helpinfo.printTo(400,500) ;

   rline.drawTo(80,105,640,3) ;
   rline.drawTo(80,490,640,3) ;

   return true ;
}

function Frame(dt) {
   if (game.isKeyDown(KEY_ESCAPE)) game.goToScript("menu",null) ;

   if (game.isKeyDown(KEY_UP))
     if (tekpage>0) tekpage-- ;
   if (game.isKeyDown(KEY_DOWN))
     if (tekpage<PAGE_COUNT-1) tekpage++ ;

   return true ;
}