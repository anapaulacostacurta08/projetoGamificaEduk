var user_UID = sessionStorage.userUid;
getCurrentUser(user_UID);
User = getUser();

if(sessionStorage.profile_atualizar == "true"){
    var btn_jogar = document.getElementById("btnJogar");
    btn_jogar.disabled = true;   
}

function jogar(){
    window.location.href = "./home.html";
}

function atualizar(){
    window.location.href = "./atualizacao.html";
}
/**
<a class="nav-link" href="../adm/boardgames/boardgames.html">Cadastrar Rodada</a></li>
<a class="nav-link" href="../adm/boardgames/startboardgames.html">Iniciar Rodada</a></li>
<a class="nav-link" href="../adm/boardgames/closeboardgames.html">Encerrar Rodada</a></li>**/

firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
});

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function getCurrentUser(user_UID){
    if (sessionStorage.User === undefined) {
        return userService.findByUid(user_UID).then (user=>{
            if(user === undefined){
                sessionStorage.setItem("profile_atualizar",true);
            }else{
                sessionStorage.setItem("profile_atualizar",false);
                setUser(user);
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

function setUser(User){
    let UserString = JSON.stringify(User);
    sessionStorage.setItem('User', UserString);
}
  
function getUser(){
    let userString = sessionStorage.User;
    let user;
    if(!(userString === undefined)){
        user = JSON.parse(userString);
    }
    console.log(user);
    return user;
}


