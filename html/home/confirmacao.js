firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }else{
        const user_UID = user.uid;
        getCurrentUser(user.uid).then(users => { 

        });
        function getCurrentUser(){
            userService.findByUid(user_UID).then(user=>{
                    if(user === undefined){
                        var btn_jogar = document.getElementById("btnJogar");
                        btn_jogar.disabled = true;  
                        alert("Seu perfil precisa ser atualizado e ativado!Acesse o menu perfil.");
                    }
            }).catch(error => {
                console.log(error);
            });
        }
    }
})
//const user_UID = sessionStorage.userUid;
//const User = getCurrentUser();
//const boardgamesToday = getBoardgamesToday();
//const quizzes = getQuizzes();
const token_quiz = getTokensQuiz();

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

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}


