function loadProfile() {
   var profile = system.loadObjectFromAppData("profile_v1.json") ;
   if (profile==null)
     profile = { version: 1, nextlevel: 0, 
       levels_easy:[],
       levels_norm:[],
       levels_hard:[]
     } ;
   else {
     // Этот фрагмент - как добавлять новые поля в профиль при изменении программы
     //if (isNaN(profile.money_d)) profile.money_d=0 ;
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
