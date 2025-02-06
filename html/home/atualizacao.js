firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
});

var user_UID = sessionStorage.userUid;

function save_profile(){
    const name = document.getElementById("nome");
    const select = document.getElementById("profile");
    const profileUser = select.options[select.selectedIndex].value;
    
    var admin = false;
    var aluno = false;
    var professor = false;

    if(profileUser == "professor"){
        professor = true;
    }else{
        if (profileUser == "aluno"){
            aluno = true;
        }
        if (profileUser == "admin"){
            admin = true;
        }
    }
    var profile = {admin:admin, aluno: aluno, professor: professor};
    var user = {name: name, profile, score:0, status:false};
    userService.save(user_UID,user);
    alert("Aguarde seu perfil ser ativado pelo administrador!");
    logout();
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function voltar(){
    window.location.href = "confirmacao.html";
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


