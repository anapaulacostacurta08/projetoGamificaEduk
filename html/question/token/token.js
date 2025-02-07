firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
})

var user_UID = sessionStorage.userUid;
var User = getUser();
getProfile();
var boardgame = getBoardgame;

const category = sessionStorage.question_category;

var token_quiz = getTokensQuiz();
var tokens_quiz_used = getUsedTokensQuiz();

// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
    event.preventDefault();
    // Captura os dados do formulário
    const tokenid = document.getElementById("tokenid").value;

        if(category == "quiz"){
            let pos_token = token_quiz.indexOf(tokenid);
            if(!(tokens_quiz_used === "undefined")){
                    if(pos_token > -1){
                        tokenValidoQuiz();
                    }else{
                        tokenInvalido();
                    }
            }else{    
                let pos_token_used = tokens_quiz_used.indexOf(tokenid);   
                if (pos_token_used > -1){
                    tokenValidoQuiz
                }else{
                    let pos_token = token_quiz.indexOf(tokenid);
                    if(pos_token > -1){
                        tokenValidoQuiz();
                    }else{
                        tokenInvalido();
                    }
                }
            }     
        }
        if(category == "challange"){
            window.location.href = "../challange/challange.html";
        }
        if(category == "luck"){
            window.location.href = "../luck/luck.html";
        }
        if(category == "quiz_final"){
            window.location.href = "../final/final.html";
        }
});

function tokenInvalido(){
    alert("Token inválido!");
    window.location.href = "../../play/menu.html";
}

function tokenValidoQuiz(tokenid,remove){
    alert("Token Válido!");
    sessionStorage.setItem("token_quiz",tokenid); // Manter o token durante a resposta da pergunta
    if(remove){
        setTokensQuiz(tokenid);
    }
    window.location.href = "../quiz/quiz.html";
}

function getTokensQuiz(){
        var tokensString = sessionStorage.tokens_quiz;
        var tokens_quiz;
        if (tokensString === undefined || tokensString === "undefined"){
            tokenService.getTokens().then(tokens => {
                tokens.forEach(token => {
                    tokensString = JSON.stringify(token.quiz);
                    // Store the stringified object in sessionStorage
                    sessionStorage.setItem('tokens_quiz', tokensString);
                });
            });
        }else{
            // Convert the user object into a string
            tokens_quiz = JSON.parse(tokensString);
        }
        return tokens_quiz;
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../../home/home.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}    
  

function getUser(){
    let UserString = sessionStorage.User;
    let User = JSON.parse(UserString);
    console.log(User);
    return User;
  }
  
  function getProfile(){
    if(User === undefined || User === "undefined"){
        User = getUser();
    }
    document.getElementById("nameUser").innerHTML = User.nickname;
    var avatar = User.avatar;
    document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
    document.getElementById("score_total").innerHTML = User.score;
    document.getElementById("score_round").innerHTML = sessionStorage.score_round;
    document.getElementById("level").innerHTML = sessionStorage.level;
  }

  function voltar(){
    window.location.href = "../../play/menu.html";
  }

  
function getBoardgame(){
    let boardgameString = sessionStorage.boardgame;
    let boardgame = JSON.parse(boardgameString);
    console.log(boardgame);
    return boardgame;
}

function getUsedTokensQuiz(){
    // Get the stringified object from sessionStorage
    let tokens_quizString = sessionStorage.usedtokens_quiz;
    let usedtokens_quiz;
    if(tokens_quizString === undefined || tokens_quizString === "undefined"){
      var boardgame = getBoardgame();
      var players = boardgame.dados.players;
      players.forEach(player => {
        if(player.user_UID == user_UID){
          usedtokens_quiz = player.usedtokens_quiz;
          sessionStorage.setItem('usedtokens_quiz', JSON.stringify(usedtokens_quiz));
        }
      })
    }else{
      // Parse the string back into an object
      usedtokens_quiz = JSON.parse(tokens_quizString);
      console.log(usedtokens_quiz);
    }
    return usedtokens_quiz;
}

function setTokensQuiz(tokenid){
    // Convert the user object into a string
    let removetoken = tokens_quiz.splice(tokens_quiz.indexOf(tokenid),1);
    console.log(removetoken);
    let tokensString = JSON.stringify(tokens_quiz);
    // Store the stringified object in sessionStorage
    console.log(tokensString);
    sessionStorage.setItem('tokens_quiz', tokensString);
  }