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

function saveProfile(profile) {
   system.saveObjectToAppData("profile_v1.json",profile) ;
}
