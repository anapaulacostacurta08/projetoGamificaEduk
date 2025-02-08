getProfile();

function getProfile(){
    document.getElementById("nameUser").innerHTML = User.nickname;
    var avatar = User.avatar;
    document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
    document.getElementById("score_total").innerHTML = User.score;
}

function jogar() {
    window.location.href = "../play/play.html";
}

function voltar() {
    window.location.href = "./confirmacao.html";
}

function ranking_geral() {
    window.location.href = "../ranking/geral/geralranking.html";
}

function ranking_nivel() {
    window.location.href = "../ranking/level/levelranking.html";
}

function extrato() {
    window.location.href = "../extrato/extrato.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}


