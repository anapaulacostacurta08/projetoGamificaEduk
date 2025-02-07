sessionStorage.setItem('hasquiz',true);
const boardgame = getBoardgame();
//Buscar quiz e colocar na sessão;
var quizzes = getQuizzes();
const quiz = getAtualQuiz();
var user_UID = sessionStorage.userUid;

let hasquiz;
if (sessionStorage.hasquiz === undefined) {
  sessionStorage.setItem("hasquiz",true);
}else{
  if(sessionStorage.hasquiz == "true"){
    hasquiz = true;
  }else{
    hasquiz = false;
  }
}
if(hasquiz){
    showQuestion(quiz);
    startTimer(15);
}

function getQuizzes(){
    var quizzesString = sessionStorage.quizzes;
    var quizzes;
    if (quizzesString  === undefined){
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
    let quizString;
    let answerString;
    let categoryString;
    let numbString;
    let quizAtual;
    //buscar as questões da sessão
    if( quizzes === undefined){
      quizzes = getQuizzes();
    }
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
      return quizAtual;
}

function setQuizzes(questions){
    // Convert the user object into a string
    let quizzesString = JSON.stringify(questions);
    // Store the stringified object in sessionStorage
    sessionStorage.setItem('quizzes', quizzesString);
    //sessionStorage.setItem('answered_quizzes', JSON.stringify(new Array()));
}

function getAnsweredQuizzes(){
  // Get the stringified object from sessionStorage
  let answered_quizzesString = sessionStorage.answered_quizzes;
  let answered_quizzes;
  if(answered_quizzesString === undefined){
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

function fechar(){
    sessionStorage.removeItem('token_quiz');
    sessionStorage.removeItem('quiz');
    window.location.href = "../../play/menu.html";
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

  