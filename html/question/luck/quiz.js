sessionStorage.setItem('hasquiz',true);

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
//Buscar quiz e colocar na sessão;
var quizzes = getQuizzes();

const quiz = getAtualQuiz();

if(hasquiz){
    showQuiz(quiz);
    startTimer(15);
}else{
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('quiz');
    sessionStorage.removeItem('answer');
    window.location.href = "../../play/menu.html";
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
    let typeString;
    let numbString;
    //buscar as questões da sessão
    quizzes.forEach(quiz => {
      if(answered_quizzes.indexOf(quiz.numb) == -1){ //Não foi respondida
        quizString = JSON.stringify(quiz);
        answerString = quiz.answer[0];
        typeString = quiz.type;
        numbString = quiz.numb;
      }
    });
    //Coloca quiz atual na sessão.
      sessionStorage.setItem('quiz', quizString);
      sessionStorage.setItem('answer',answerString);
      sessionStorage.setItem('question_numb',numbString);
      sessionStorage.setItem('question_type',typeString);
      return quizString;
}

function setQuizzes(questions){
    // Convert the user object into a string
    let quizzesString = JSON.stringify(questions);
    // Store the stringified object in sessionStorage
    sessionStorage.setItem('quizzes', quizzesString);
    sessionStorage.setItem('answered_quizzes', JSON.stringify(new Array()));
}

function getAnsweredQuizzes(){
  // Get the stringified object from sessionStorage
  let answered_quizzesString = sessionStorage.answered_quizzes;
    // Parse the string back into an object
  let answered_quizzes = JSON.parse(answered_quizzesString);
  console.log(answered_quizzes);
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

document.getElementById("question-form").addEventListener("submit", function(event) {
    event.preventDefault();

  //Atualizar Quiz respondido na sessão
   let answered_quizzes = getAnsweredQuizzes();
   answered_quizzes.push(quiz.numb);
   sessionStorage.setItem('answered_quizzes', JSON.stringify(answered_quizzes));
   //limpar token da sessão e quiz atual 
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('quiz');
    window.location.href = "../../play/menu.html";
  });