firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "../login/login.html";
    }else{
        userService.findByUid(user.uid).then(user=>{
            if(user === undefined){
                var btn_jogar = document.getElementById("btnJogar");
                btn_jogar.disabled = true;  
                alert("Seu perfil precisa ser atualizado e ativado!Acesse o menu perfil.");
            }else{
                document.getElementById("nameUser").innerHTML = user.nickname;
                var avatar = user.avatar;
                document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
                document.getElementById("score_total").innerHTML = user.score;
            }
        }).catch(error => {
            console.log(error);
        });
    }
})

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
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}


