firebase.auth().onAuthStateChanged( (user) => {
    if (!user) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }
})

var user_UID = sessionStorage.userUid;
var User = getUser();
getProfile();


const category = sessionStorage.question_category;

var tokens = getTokens(category);

// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
    event.preventDefault();
    // Captura os dados do formulário
    const tokenid = document.getElementById("tokenid").value;
    
        if(category == "quiz"){
            let pos_token = tokens.indexOf(tokenid);
            if ( pos_token > -1){
                alert("Token Válido!");
                sessionStorage.setItem("token",tokenid); // Manter o token durante a resposta da pergunta
                setTokens(tokens, tokenid);//removendo apenas da sessão o token utilizado.
                window.location.href = "../quiz/quiz.html";
            }else{
                alert("Token inválido!");
                window.location.href = "../../play/menu.html";
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


function getTokens(){
    var tokensString = sessionStorage.tokens;
    var tokens;
    if (tokensString === undefined){
        tokenService.getTokens().then(tokens => {
            tokens.forEach(token => {
                tokensString = JSON.stringify(token.quiz);
                // Store the stringified object in sessionStorage
                sessionStorage.setItem('tokens', tokensString);
            });
        });
    }else{
        // Convert the user object into a string
        tokens = JSON.parse(tokensString);
    }
    return tokens;
}


function setTokens(tokens, tokenid){
  // Convert the user object into a string
  let removetoken = tokens.splice(tokens.indexOf(tokenid),1);
  console.log(removetoken);
  let tokensString = JSON.stringify(tokens);
  // Store the stringified object in sessionStorage
  console.log(tokensString);
  sessionStorage.setItem('tokens', tokensString);
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
    if(User === undefined){
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