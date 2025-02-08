firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
      sessionStorage.clear;
      window.location.href = "../login/login.html";
  }
})

var user_UID = sessionStorage.userUid;
var User = getUser();
getProfile();
var boardgame = getBoardgame();
var quizzes = getQuizzes();
const quiz = getAtualQuiz();

function btnQuiz() {
  sessionStorage.setItem("question_category","quiz");
  window.location.href = "../question/token/token.html";
}

function existsQuiz(){
  let hasquiz;
  if (sessionStorage.hasquiz === undefined || sessionStorage.hasquiz === "undefined") {
    sessionStorage.setItem("hasquiz",true);
  }else{
    if(sessionStorage.hasquiz == "true"){
      hasquiz = true;
    }else{
      hasquiz = false;
    }
  }
  if(!hasquiz){
    //Não tem mais Quiz para apresentar desativa o botão
    document.getElementById("btnQuiz").disabled = true;
  }
}

function btnDesafio() {
  sessionStorage.setItem("question_category","challange");
  window.location.href = "../question/token/token.html";
}

function existsChallange(){
  let haschallange;
  if (sessionStorage.haschallange === undefined || sessionStorage.haschallange === "undefined") {
    sessionStorage.setItem("haschallange",true);
  }else{
    if(sessionStorage.haschallange == "true"){
      haschallange = true;
    }else{
      haschallange = false;
    }
  }

  if(!haschallange){
    //Não tem mais Quiz para apresentar desativa o botão
    document.getElementById("btnDesafio").disabled = true;
  }
}


function btnSorte() {
  sessionStorage.setItem("question_category","luck");
  window.location.href = "../question/token/token.html";
}

function existsLuck(){
  let hasluck;
  if ( (sessionStorage.hasluck === undefined) || (sessionStorage.hasluck === "undefined")) {
    sessionStorage.setItem("hasluck",true);
  }else{
    if(sessionStorage.hasluck == "true"){
      hasluck = true;
    }else{
      hasluck = false;
    }
  }
  if(!hasluck){
    //Não tem mais Quiz para apresentar desativa o botão
    document.getElementById("btnSorte").disabled = true;
  }
}

function btnExtra(){
  window.location.href = "../extra/extra.html";
}

function btnQuizfinal(){
  sessionStorage.setItem("question_category","quiz_final");
  window.location.href = "../question/token/token.html";
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
  document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
  document.getElementById("score_total").innerHTML = User.score;
  document.getElementById("score_round").innerHTML = sessionStorage.score_round;
  document.getElementById("level").innerHTML = sessionStorage.level;
}

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../home/home.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function btnVoltar(){
  window.location.href = "../home/home.html";
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

function getAnsweredQuizzes(){
  // Get the stringified object from sessionStorage
  let answered_quizzesString = sessionStorage.answered_quizzes;
  let answered_quizzes;
  if(answered_quizzesString === undefined || answered_quizzesString === "undefined"){
    var boardgame = getBoardgame();
    var players = boardgame.dados.players;
    players.forEach(player => {
      if(player.user_UID == user_UID){
        answered_quizzes = player.answered_quizzes;
        sessionStorage.setItem('answered_quizzes', JSON.stringify(answered_quizzes));
      }
    })
  }else{
    // Parse the string back into an object
    answered_quizzes = JSON.parse(answered_quizzesString);
    console.log(answered_quizzes);
  }
  return answered_quizzes;
}

function getQuizzes(){
  var quizzesString = sessionStorage.quizzes;
  var quizzes;
  if (quizzesString  === undefined || quizzesString  === "undefined"){
    questionsService.getQuizzesByLevel(parseInt(sessionStorage.level),"quiz").then(questions =>{
      console.log(questions);
      setQuizzes(questions);
    });
  }else{
    quizzes = JSON.parse(quizzesString);
    console.log(quizzes);
  }
  return quizzes;
}

function setAtualQuiz(){
  let answered_quizzes = getAnsweredQuizzes();
  if(answered_quizzes === undefined || answered_quizzes === "undefined"){
    answered_quizzes = new Array();
  }
  let quizString;
  let answerString;
  let categoryString;
  let numbString;
  let quizAtual;
  //buscar as questões da sessão
  if( !(quizzes === undefined)){
    quizzes.forEach(quiz => {
      if(answered_quizzes.indexOf(quiz.numb) == -1){ //Não foi respondida
        quizString = JSON.stringify(quiz);
        answerString = quiz.answer[0];
        categoryString = quiz.category;
        numbString = quiz.numb;
      }
    });
    //Coloca quiz atual na sessão.
    sessionStorage.setItem('quiz', quizString);
    sessionStorage.setItem('answer',answerString);
    sessionStorage.setItem('question_numb',numbString);
    sessionStorage.setItem('question_category',categoryString);
    quizAtual = JSON.parse(quizString);
  }
  return quizAtual;
}

function setQuizzes(questions){
  // Convert the user object into a string
  let quizzesString = JSON.stringify(questions);
  // Store the stringified object in sessionStorage
  sessionStorage.setItem('quizzes', quizzesString);
  //sessionStorage.setItem('answered_quizzes', JSON.stringify(new Array()));
}

function getAtualQuiz(){
  let quizString = sessionStorage.quiz;
  let quiz;
  if (quizString === undefined || quizString === "undefined"){
    quizString = setAtualQuiz();
  }
  if(quizString === undefined || quizString === "undefined"){
    sessionStorage.setItem('hasquiz',false);
  }else {
    sessionStorage.setItem('hasquiz',true);
    quiz = JSON.parse(quizString);
    console.log(quiz);
  }
  return quiz;
}