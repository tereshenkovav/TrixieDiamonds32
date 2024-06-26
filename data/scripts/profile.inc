function loadProfile() {
   var profile = system.loadObjectFromAppData("profile_v1.json") ;
   if (profile==null)
     profile = { version: 1, nextlevel: 0, soundon: true, fullscreen: false,
       levels_easy:[],
       levels_norm:[],
       levels_hard:[],
       secret_0:false,
       secret_1:false,
       secret_2:false,
       key_left: KEY_LEFT,
       key_right: KEY_RIGHT,
       key_teleportup: KEY_UP,
       key_teleportdown: KEY_DOWN,
       key_stop: KEY_SPACE,
       key_fire: KEY_CONTROL,
       key_shield: KEY_ALT,
       key_jump: KEY_SHIFT
     } ;
   else {
     // Этот фрагмент - как добавлять новые поля в профиль при изменении программы
     if (isNaN(profile.soundon)) profile.soundon=true ;
     if (isNaN(profile.fullscreen)) profile.fullscreen=false ;
     if (isNaN(profile.secret_0)) profile.secret_0=false ;
     if (isNaN(profile.secret_1)) profile.secret_1=false ;
     if (isNaN(profile.secret_2)) profile.secret_2=false ;
     if (isNaN(profile.key_left)) profile.key_left=KEY_LEFT ;
     if (isNaN(profile.key_right)) profile.key_right=KEY_RIGHT ;
     if (isNaN(profile.key_teleportup)) profile.key_teleportup=KEY_UP ;
     if (isNaN(profile.key_teleportdown)) profile.key_teleportdown=KEY_DOWN ;
     if (isNaN(profile.key_stop)) profile.key_stop=KEY_SPACE ;
     if (isNaN(profile.key_fire)) profile.key_fire=KEY_CONTROL ;
     if (isNaN(profile.key_shield)) profile.key_shield=KEY_ALT ;
     if (isNaN(profile.key_jump)) profile.key_jump=KEY_SHIFT ;
   }
   return profile;
}

function getLevelsByDifficult(profile) {
   if (system.getDifficult()==0) return profile.levels_easy ;
   if (system.getDifficult()==1) return profile.levels_norm ;
   if (system.getDifficult()==2) return profile.levels_hard ;
}

function getLevelsByDifficultN(profile,n) {
   if (n==0) return profile.levels_easy ;
   if (n==1) return profile.levels_norm ;
   if (n==2) return profile.levels_hard ;
}

function saveProfile(profile) {
   system.saveObjectToAppData("profile_v1.json",profile) ;
}
