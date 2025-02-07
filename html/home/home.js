firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
});

var data_today = (new Date()).toLocaleDateString('pt-BR');
var user_UID = sessionStorage.userUid;
var User = getCurrentUser(user_UID);
getProfile();
var boardgames = getBoardgamesToday();

function getProfile(){
    if(User === undefined){
        User = getUser();
    }
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

function getCurrentUser(user_UID){
    if (sessionStorage.User === undefined) {
        return userService.findByUid(user_UID).then (user=>{
            if(user === undefined){
                sessionStorage.setItem("profile_atualizar",true);
            }else{
                sessionStorage.setItem("profile_atualizar",false);
                setUser(user);
                getUser();
            }
        }).catch(error => {
            console.log(error);
        });
    }else{
        return getUser();
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

function getBoardgamesToday(){
    boardgamesService.getBoardgamebyData(data_today).then(boardgames =>{
      setBoardgamesToday(boardgames);
    })
}
  
function getBoardgamesToday(){
    let boardgamesString = sessionStorage.boardgamesToday;
    if(boardgamesString === undefined || boardgamesString === "undefined"){
        boardgamesString = getBoardgamesToday();
    }
    let boardgames = JSON.parse(boardgameString);
    console.log(boardgames);
    return boardgames;
}

function setBoardgamesToday(boardgames){
    let boardgamesString = JSON.stringify(boardgames);
    sessionStorage.setItem('boardgamesToday', boardgamesString);
    return boardgamesString;
}
