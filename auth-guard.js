firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        sessionStorage.setItem("userUid", user.uid);
        window.location.href = "../home/home.html";
    }else{
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
    userService.findByUid(uid).then (user=>{
        if(user === undefined){
            sessionStorage.setItem("profile_atualizar",true);
        }else{
            sessionStorage.setItem("profile_atualizar",false);
            document.getElementById("nameUser").innerHTML = user.name;
            sessionStorage.setItem("score_total",user.score);
            const profiles = user.profiles;
            sessionStorage.setItem("admin",profiles.admin);
            sessionStorage.setItem("professor",profiles.admin);
            sessionStorage.setItem("aluno",profiles.admin);
        }
    }).catch(error => {
        console.log(getErrorMessage(error));
    });
})


