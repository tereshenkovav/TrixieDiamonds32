function loadProfile() {
   var profile = system.loadObjectFromAppData("profile_v1.json") ;
   if (profile==null)
     profile = { version: 1, nextlevel: 0, soundon: true, fullscreen: false,
       levels_easy:[],
       levels_norm:[],
       levels_hard:[],
       secret_0:false,
       secret_1:false,
       secret_2:false
     } ;
   else {
     // Этот фрагмент - как добавлять новые поля в профиль при изменении программы
     if (isNaN(profile.soundon)) profile.soundon=true ;
     if (isNaN(profile.fullscreen)) profile.fullscreen=false ;
     if (isNaN(profile.secret_0)) profile.secret_0=false ;
     if (isNaN(profile.secret_1)) profile.secret_1=false ;
     if (isNaN(profile.secret_2)) profile.secret_2=false ;
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
