var trixie_wait ;
var trixie_walk ;
var trixie_win ;
var trixie_width ;
var text_win ;
var text_fail ;
var text_back ;
var text_next ;
var text_restart ;
var text_bonuscount ;
var text_pause ;
var text_finpause ;
var fireball ;
var spr_bonus ;
var spr_heart ;
var spr_overkill ;
var spr_mana ;
var spr_bonus_gray ;
var spr_heart_gray ;
var spr_mana_gray ;
var rects_gameover = new Array();
var rects_sky = new Array();
var teleport ;
var strings ;
var balance ;
var mapparam ;
var playery ;
var playerx ;
var playervx ;
var lastplayervsig ;
var targety ;
var teleport_left=-1 ;
var manacount ;
var bonuscount ;
var leftspawnbonus ;
var leftspawnmonsters ;
var health ;
var hittime ;
var gameover ;
var iswin ;
var snd_bonusget ;
var snd_fireball ;
var snd_hit ;
var snd_teleport ;
var teklevel ;
var tekmode ;
var monsters = new Array() ;
var monsterspr = new Array() ;
var monstertypes = new Array() ;
var bonus = new Array() ;
var cloudspr = new Array() ;
var clouds = new Array() ;
var fire = new Array() ;
var ispaused ;
var shield ;
var shield_time ;

const TELEPORT_HALFTIME=0.45 ;
const SKY_SECTIONS=32;

$include<rects.inc>
$include<consts.inc>
$include<funcs.inc>
$include<profile.inc>

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function upMana() {
  if (ispaused) return ;
  if (gameover) return ;

  if (manacount<balance.MaxMana) manacount++ ;
}

function spawnMonster() {
  if (ispaused) return ;
  if (gameover) return ;
  if (teleport_left>0) return ; // «апрет на спавн монстров при телепортации пони

  if ((leftspawnmonsters<=0)&&(tekmode=="arcade")) return ;
  leftspawnmonsters-- ;

  var sp = mapviewer.genSpawnPoint(playerx,playery) ;
  var midx = getRandomInt(0,monstertypes.length-1) ;
  monsters.push({ x: sp.x, y: sp.y, mtype: midx, 
    shifty: monstertypes[midx].shifty, 
    width: monsterspr[midx].getWidth(),
    isfly: monstertypes[midx].isfly,
    speed: (getRandomInt(0,1)==0?1:-1)*monstertypes[midx].speed }) ;
}

function spawnBonus() {
  if (ispaused) return ;
  if (gameover) return ;

  if ((leftspawnbonus<=0)&&(tekmode=="arcade")) return ;
  leftspawnbonus-- ;

  var sp = mapviewer.genSpawnPoint(playerx,playery) ;
  var d = 0 ;
  for (var i=0; i<bonus.length;i++)
    if ((bonus[i].y==sp.y)&&(Math.abs(bonus[i].x-sp.x)<=1)) d++ ;
  bonus.push({ x: sp.x, y: sp.y, dy: 5*d, type: "diamond" }) ;
}

function goEndGame(win) {
   snd_teleport.play() ;
   teleport.playOneTime() ;
   teleport_left=TELEPORT_HALFTIME ;
   playervx=0 ;
   gameover=true ; 
   iswin=win ;
   if (win) {
     var profile = loadProfile() ;
     if (profile.nextlevel<teklevel+1) profile.nextlevel=teklevel+1 ;
     if (getLevelsByDifficult(profile).indexOf(teklevel)==-1)
       getLevelsByDifficult(profile).push(teklevel) ;
     saveProfile(profile) ;
   }
}

function Init(args) {
   strings = system.loadObject("strings.json") ;
   balance = system.loadObject("common_balance.json") ;
   var diff_balance = system.loadObject("difficults.json")[system.getDifficult()] ;
   if (diff_balance.MaxMana!=undefined)
      balance.MaxMana = diff_balance.MaxMana ;
   if (diff_balance.MaxHealth!=undefined)
      balance.MaxHealth = diff_balance.MaxHealth ;
   if (diff_balance.ManaUpIntervalMS!=undefined)
      balance.ManaUpIntervalMS = diff_balance.ManaUpIntervalMS ;
   
   teklevel = args.level ;
   tekmode = args.mode ;

   game.setBackgroundColor(109,176,255) ;

   mapviewer.loadMapFromFile("maps/map_"+teklevel+".dat") ;
   mapparam = system.loadObject("maps/map_"+teklevel+".json") ;

   if (diff_balance.MonsterSpawnMultK!=undefined)
      mapparam.MonsterSpawnIntervalMS*=(1.0-diff_balance.MonsterSpawnMultK) ;

   for (var i=0; i<mapparam.ExtraBonuses.length; i++) 
     bonus.push({ x: mapparam.ExtraBonuses[i].x, 
                  y: mapparam.ExtraBonuses[i].y, 
                  dy: 0, type: mapparam.ExtraBonuses[i].type }) ;
         
   trixie_wait = game.loadSpritePCX8bit('trx_wait.pcx',true) ;
   trixie_wait.setSmooth(false) ;
   trixie_width = trixie_wait.getWidth() ;

   trixie_win = game.loadSpritePCX8bit('win.pcx',true) ;
   trixie_win.setSmooth(false) ;

   trixie_walk = game.loadAnimationPCX8bit('trx_walk.pcx',11,9,true) ;
   trixie_walk.play() ;
   trixie_walk.setSmooth(false) ;

   shield = game.loadAnimationPCX8bit('shield.pcx',48,48,4,9,true) ;
   shield.play() ;
   shield.setScale(120,120) ;
   shield.setSmooth(false) ;

   fireball = game.loadAnimationPCX8bit('fireball.pcx',5,9,true) ;
   fireball.play() ;
   fireball.setSmooth(false) ;

   teleport = game.loadAnimationPCX8bit('teleport.pcx',40,25,9,9,true) ;  
   teleport.setScale(200,200) ;
   teleport.setSmooth(false) ;

   spr_bonus = game.loadSpritePCX8bit('bonus.pcx',true) ;
   spr_bonus.setSmooth(false) ;
   spr_bonus.setScale(200,200) ;

   spr_bonus_gray = game.loadSpritePCX8bit('bonus.pcx',true) ;
   spr_bonus_gray.setSmooth(false) ;
   spr_bonus_gray.setScale(200,200) ;
   spr_bonus_gray.convertPixels("funcGray") ;

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

   spr_overkill = game.loadSpritePCX8bit('overkill.pcx',true) ;
   spr_overkill.setSmooth(false) ;
   spr_overkill.setScale(200,200) ;

   snd_bonusget = game.loadSound("bonusget.wav") ;
   snd_fireball = game.loadSound("fireball.wav") ;
   snd_teleport = game.loadSound("teleport.wav") ;
   snd_hit = game.loadSound("hit.wav") ;

   playerx=mapparam.StartX ;
   playery=mapparam.StartY ;
   playervx=0 ;
   lastplayervsig=1 ; // „тобы работал fireball по умолчанию

   manacount = balance.MaxMana ;
   health = balance.MaxHealth ;
   bonuscount = 0 ;
   leftspawnbonus = mapparam.MaxSpawnBonus ;
   leftspawnmonsters = mapparam.MaxSpawnMonsters ;
   hittime=-1 ;
   shield_time=-1 ;
   gameover=false ;
   ispaused=false ;

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
   
   monstertypes.push({ speed: 20, shifty:-7, isfly:false }) ;
   monstertypes.push({ speed: 40, shifty:-12, isfly:true }) ;
   monstertypes.push({ speed: 60, shifty:-12, isfly:true }) ;
   monstertypes.push({ speed: 20, shifty:-7, isfly:true }) ;
   monstertypes.push({ speed: 40, shifty:-7, isfly:false }) ;

   system.setInterval("upMana()",balance.ManaUpIntervalMS) ;
   system.setInterval("spawnMonster()",mapparam.MonsterSpawnIntervalMS) ;
   system.setInterval("spawnBonus()",mapparam.BonusSpawnIntervalMS) ;

   for (var i=0; i<mapparam.InitialMonsters; i++)
     spawnMonster() ;
   for (var i=0; i<mapparam.InitialBonuses; i++)
     spawnBonus() ;

   makeRects(rects_gameover) ;

   var r1 = 105 ; var g1 = 146 ; var b1 = 255 ;
   var r2 = 163 ; var g2 = 203 ; var b2 = 255 ; 
   for (var i=0; i<SKY_SECTIONS; i++)
     rects_sky.push(game.createRect(
       r1+i*(r2-r1)/SKY_SECTIONS,
       g1+i*(g2-g1)/SKY_SECTIONS,
       b1+i*(b2-b1)/SKY_SECTIONS)) ;

   cloudspr.push(game.loadSpritePCX8bit('sky1.pcx',true)) ;
   cloudspr.push(game.loadSpritePCX8bit('sky2.pcx',true)) ;
   cloudspr.push(game.loadSpritePCX8bit('sky3.pcx',true)) ;
   cloudspr.push(game.loadSpritePCX8bit('sky4.pcx',true)) ;
   cloudspr.push(game.loadSpritePCX8bit('sky5.pcx',true)) ;

   for (var i=0; i<10; i++)
      clouds.push({x: getRandomInt(-100,800), 
                   y:100+i*30, 
                   vx: getRandomInt(10,20),
                   spr_idx: getRandomInt(0,4)}) ;

   text_win = game.loadText("arial.ttf",strings.textwin,28) ;
   text_win.setColor(200,200,200) ;
   text_fail = game.loadText("arial.ttf",strings.textfail,28) ;
   text_fail.setColor(200,200,200) ;
   text_back = game.loadText("arial.ttf",strings.textback,16) ;
   text_back.setColor(180,180,180) ;
   text_next = game.loadText("arial.ttf",strings.textnext,16) ;
   text_next.setColor(180,180,180) ;
   text_restart = game.loadText("arial.ttf",strings.textrestart,16) ;
   text_restart.setColor(180,180,180) ;
   text_bonuscount = game.loadText("arial.ttf","",28) ;
   text_bonuscount.setColor(255,255,255) ;
   text_pause = game.loadText("arial.ttf",strings.textpause,28) ;
   text_pause.setColor(200,200,200) ;
   text_finpause = game.loadText("arial.ttf",strings.textfinpause,16) ;
   text_finpause.setColor(180,180,180) ;

   return true ;
}
 
function Render() {
   for (var i=0; i<SKY_SECTIONS; i++)
      rects_sky[i].drawTo(0,i*(600/SKY_SECTIONS),800,(600/SKY_SECTIONS)+2) ;

   for (var i=0; i<clouds.length; i++)
     cloudspr[clouds[i].spr_idx].renderTo(clouds[i].x,clouds[i].y) ;

   mapviewer.render() ;

   if (!((gameover)&&(teleport_left<=0)))

   if ((hittime<=0)||(Math.floor(4*hittime) % 2 == 0))
     ((playervx!=0)?trixie_walk:trixie_wait).renderTo
       (playerx,mapviewer.getPlateY(playery)-trixie_walk.getHeight()/2-5) ;

   if ((shield_time>0)&&(!gameover))
     shield.renderTo(playerx,mapviewer.getPlateY(playery)-trixie_walk.getHeight()/2-5) ;

   for (var i=0; i<monsters.length; i++) {
     var spr = monsterspr[monsters[i].mtype] ;
     spr.mirrorHorz(monsters[i].speed<0) ;
     spr.renderTo(monsters[i].x,mapviewer.getPlateY(monsters[i].y)-
        1.5*spr.getHeight()/2+monsters[i].shifty) ;
   }

   for (var i=0; i<bonus.length; i++) {
     if (bonus[i].type=="diamond")
       spr_bonus.renderTo(bonus[i].x,mapviewer.getPlateY(bonus[i].y)-
         1.5*spr_bonus.getHeight()-bonus[i].dy) ;
     if (bonus[i].type=="heart")
       spr_heart.renderTo(bonus[i].x,mapviewer.getPlateY(bonus[i].y)-
         1.5*spr_heart.getHeight()-bonus[i].dy) ;
     if (bonus[i].type=="mana")
       spr_mana.renderTo(bonus[i].x,mapviewer.getPlateY(bonus[i].y)-
         1.5*spr_mana.getHeight()-bonus[i].dy) ;
     if (bonus[i].type=="overkill")
       spr_overkill.renderTo(bonus[i].x,mapviewer.getPlateY(bonus[i].y)-
         1.5*spr_overkill.getHeight()-bonus[i].dy) ;
   }

   for (var i=0; i<fire.length; i++) {
     fireball.mirrorHorz(fire[i].vx<0) ;
     fireball.renderTo(fire[i].x,mapviewer.getPlateY(fire[i].y)-fireball.getHeight()) ;
   }

   if (teleport.isPlayed()) teleport.renderTo(playerx,mapviewer.getPlateY(playery)-trixie_walk.getWidth()/2-5) ;

   for (var i=0; i<balance.MaxMana; i++)     
     ((i<manacount)?spr_mana:spr_mana_gray).renderTo(20+i*(2*spr_mana.getWidth()+5),20) ;
   for (var i=0; i<balance.MaxHealth; i++)
     ((i<health)?spr_heart:spr_heart_gray).renderTo(300+i*(2*spr_heart.getWidth()+5),20) ;

   if (tekmode=="arcade") {
   var bonus1 = Math.floor(mapparam.MaxBonus/2) ;
   if (mapparam.MaxBonus % 2>0.5) bonus1++ ;
   var bonus2 = mapparam.MaxBonus - bonus1 ;
   for (var i=0; i<bonus1; i++)
     ((i<bonuscount)?spr_bonus:spr_bonus_gray).renderTo(450+i*(2*spr_bonus.getWidth()+5),20) ;
   for (var i=0; i<bonus2; i++)
     ((i+bonus1<bonuscount)?spr_bonus:spr_bonus_gray).renderTo(450+15+i*(2*spr_bonus.getWidth()+5),45) ;
   }
   else {
     spr_bonus.renderTo(450,20) ;
     text_bonuscount.setText(" x "+bonuscount) ;
     text_bonuscount.printTo(470,2) ;
   }

   if (gameover&&(!teleport.isPlayed())) {
     renderRects(rects_gameover,250,220,300,160) ;
     if (iswin) {
       trixie_win.renderTo(310,300) ;
       text_win.printTo(360,250) ;
       text_back.printTo(360,300) ;
       text_next.printTo(360,320) ;
     }
     else {
       trixie_wait.renderTo(310,300) ;
       text_fail.printTo(360,250) ;
       text_back.printTo(360,300) ;
       text_restart.printTo(360,320) ;
     }
   }

   if (ispaused) {
     renderRects(rects_gameover,250,220,300,160) ;
     trixie_wait.renderTo(310,300) ;
     text_pause.printTo(360,250) ;
     text_finpause.printTo(360,310) ;
   }

   return true ;
}

function Frame(dt) {

   if (game.isKeyDown(KEY_ESCAPE)) 
     {
      if (gameover) game.goToScript("menu",null) ;
      ispaused=!ispaused ; return true ; 
     }     

   if (game.isKeyDown(KEY_F10)&&ispaused) game.goToScript("menu",null) ;

   if (ispaused) return true ;

   if (gameover&&(!teleport.isPlayed()))  
     if (game.isKeyDown(KEY_SPACE)) {
        if (iswin) {
          if (teklevel<LEVEL_COUNT-1)
            game.goToScript("game",{level:teklevel+1,mode:tekmode}) ;
          else
            game.goToScript("final",null) ;
        }
        else
          game.goToScript("game",{level:teklevel,mode:tekmode}) ;
     }

   if ((teleport_left<=0)&&(!gameover)) {
     if (game.isOneOfKeysDown([KEY_UP,KEY_DOWN])) {
       var dy = game.isKeyDown(KEY_DOWN)?1:-1 ;
       if (manacount>=balance.JumpManaCost) {
         teleport.playOneTime() ;
         teleport_left=TELEPORT_HALFTIME ;
         targety = playery+dy ;         
         snd_teleport.play() ;
       }
     } 
     if (game.isKeyDown(KEY_SPACE)) {
       playervx=0 ;
     }
     if (game.isOneOfKeysDown([KEY_LEFT,KEY_RIGHT])) { 
       var dx = game.isKeyDown(KEY_RIGHT)?1:-1 ;
       playervx=dx*balance.PlayerV ;
       lastplayervsig=dx ;
       trixie_wait.mirrorHorz(dx!=1) ;
       trixie_walk.mirrorHorz(dx!=1) ;
     } 
     if (game.isKeyDown(KEY_CONTROL)) 
       if (manacount>=balance.FireballManaCost) { 
         fire.push({ x: playerx, y: playery,
                     vx: balance.FireballV*lastplayervsig }) ;
         manacount-=balance.FireballManaCost ;
         snd_fireball.play() ;
       }
     if (game.isKeyDown(KEY_ALT)) 
       if ((manacount>=balance.ShieldManaCost)&&(shield_time<=0)) { 
         shield_time=balance.ProtectShieldMS/1000.0 ;
         manacount-=balance.ShieldManaCost ;
         snd_fireball.play() ;
       }
   }

   if (teleport_left>0) {
     teleport_left-=dt ;
     if (gameover) {
     }
     else
     if ((teleport_left<=0)&& 
         (mapviewer.canJumpTo(playerx,targety,trixie_width))) {
            playery=targety ;
            manacount-=balance.JumpManaCost ;
         }
   }

   for (var j=0; j<fire.length; j++) {
     var i=0 ;
     while (i<monsters.length) {
       if ((monsters[i].y==fire[j].y)&&
           (Math.abs(monsters[i].x-fire[j].x)<(monsters[i].width+fireball.getWidth())/2))
         monsters.splice(i,1) ;
       else
        i++ ;
     }   
   }

   if (!gameover) {
     var i=0 ;
     while (i<bonus.length) {
       if ((bonus[i].y==playery)&&
           (Math.abs(bonus[i].x-playerx)<(spr_bonus.getWidth()+trixie_walk.getWidth())/2)) {
         var grab = false ;
         if (bonus[i].type=="diamond") {
           bonuscount++ ;
           grab=true ;
           if ((bonuscount>=mapparam.MaxBonus)&&(tekmode=="arcade")) goEndGame(true) ;
         }
         if (bonus[i].type=="heart") {
           if (health<balance.MaxHealth) { 
             health++ ; 
             grab=true ; 
           }
         }
         if (bonus[i].type=="mana") {
           if (manacount<balance.MaxMana) {
             manacount+=balance.ManaBonusInc ;
             if (manacount>balance.MaxMana) manacount=balance.MaxMana ;
             grab=true ;
           }
         }
         if (bonus[i].type=="overkill") {
           monsters=[] ;
           grab=true ;
         }
         if (grab) {
           bonus.splice(i,1) ;
           snd_bonusget.play() ;
         }
         else
           i++ ;
       }
       else
        i++ ;
     }
   }

   for (var i=0; i<monsters.length; i++) {
     var newmonsterx = monsters[i].x+monsters[i].speed*dt ;  
     if (mapviewer.isNeedStop(monsters[i].x,newmonsterx,
                              monsters[i].y,
                              monsters[i].width/2,
			      monsters[i].isfly)) 
       monsters[i].speed=-monsters[i].speed ;
     else 
       monsters[i].x=newmonsterx ;
   }

   if ((hittime<=0)&&(!gameover)&&(shield_time<=0))
     for (var i=0; i<monsters.length; i++) 
       if ((monsters[i].y==playery)&&
           (Math.abs(monsters[i].x-playerx)<(monsters[i].width+trixie_walk.getWidth())/2)) {
         health-- ;
         if (health>0) {
           hittime=balance.ProtectAfterHitMS/1000.0 ;
           snd_hit.play() ;
         }
         else 
           goEndGame(false) ;
         break ;
       }

   var newplayerx = playerx+playervx*dt ;  
   if (mapviewer.isNeedStop(playerx,newplayerx,playery,trixie_width/2,false))
     playervx=0 ;
   else 
     playerx=newplayerx ;

   var i=0 ;
   while (i<fire.length) {
     var newfirex = fire[i].x+fire[i].vx*dt ;  
     if (mapviewer.isNeedStop(fire[i].x,newfirex,fire[i].y,fireball.getWidth()/2,true)) 
       fire.splice(i,1) ;
     else {
       fire[i].x=newfirex ;
       i++ ;
     }
   }

   if (hittime>0) hittime-=dt ;
 
   if (shield_time>0) shield_time-=dt ;

   for (var i=0; i<clouds.length; i++)
      clouds[i].x+=clouds[i].vx*dt ;

   var ci=0 ;
   var cl=clouds.length ;
   while (ci<clouds.length) {
      if (clouds[ci].x>900) clouds.splice(ci,1) ; else ci++ ;
   }
   for (var i=0; i<cl-clouds.length; i++)
      clouds.push({x: -100, 
                   y:getRandomInt(100,400), 
                   vx: getRandomInt(10,20),
                   spr_idx: getRandomInt(0,4)}) ;

   return true ;
}
