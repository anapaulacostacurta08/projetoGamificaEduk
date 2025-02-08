firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        //sessionStorage.setItem("userUid", user.uid);
        window.location.href = "../home/home.html";
    }else{
        //sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
})


