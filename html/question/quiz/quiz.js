const question_box = document.getElementById("question_box");
const que_text = document.getElementById("que_text");
const option_list = document.getElementById("option_list");
const timeText = document.getElementById("time_left_txt");
const timeCount = document.getElementById("timer_sec");

//Buscar quiz e colocar na sessão;
var user_UID = sessionStorage.userUid;
var quiz = getAtualQuiz();
showQuestion(quiz);
startTimer(15);

function showQuestion(question){
  let que_tag = '<span class="fw-bold">' +  question.numb +".</span>"+'<span class="fw-bold">' +  question.text +"</span>";
  let option_tag = 
  '<div class="option"><span class="choice-prefix m-2 p-2">A</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="1"><span class="question">' +
    question.options[0] +
    "</span></span></div>"+
    '<div class="option"><span class="choice-prefix m-2 p-2">B</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="2"><span class="question">' +
    question.options[1] +
    "</span></span></div>" +
    '<div class="option"><span class="choice-prefix m-2 p-2">C</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="3"><span class="question">' +
    question.options[2] +
    "</span></span></div>" +
    '<div class="option"><span class="choice-prefix m-2 p-2">D</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="4"><span class="question">' +
    question.options[3] +
    "</span></span></div>";
  
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  const option = option_list.querySelectorAll(".option");
  // set onclick attribute to all available options
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(answer) {
  let userAns = answer.querySelector(".choice-text").textContent; //getting user selected option
  let correcAns =  sessionStorage.answer;
  let correct;
  const allOptions = option_list.children.length; //getting all option items
  sessionStorage.setItem("userAnswer",userAns);
  if (userAns == correcAns) {
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    correct = true;
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");
    correct = false;
    for (i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correcAns) {
        //if there is an option which is matched to an array answer
        option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
        console.log("Auto selected correct answer.");
      }
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
  setScore(correct);
}

function setScore(corret){
  var boardgame = getBoardgame();
  var players = boardgame.dados.players;
  var boardgameid = boardgame.id;
  var count = 0;
  let score_old = parseInt(sessionStorage.score_round);
  let score;
  players.forEach(player => {
    if(player.user_UID == user_UID){
      if (corret){
        score = score_old + 10;
        count ++;
      }else{
        score = score_old - 5;
        count ++;
      }
      return [];
    }
  });
  count = count -1;
  
  //Salvar Score na variável
  players[count].score_round = score;

  //Atualizar os quiz respondidos
  var array_answered = players[count].quiz_answered;
  if(array_answered === undefined || array_answered === "undefined"){
    array_answered = new Array();
  }
  array_answered.push(sessionStorage.question_numb);
  players[count].push(array_answered);
  sessionStorage.setItem("answered_quizzes",JSON.stringify(array_answered));

  //Atualizar os tokens usados
  var array_tokens = players[count].usedtokens_quiz;
  if(array_tokens === undefined || array_tokens === "undefined"){
    array_tokens= new Array();
  }
  array_tokens.push(sessionStorage.token_quiz);
  players[count].push(array_tokens);
  sessionStorage.setItem("usedtokens_quiz",JSON.stringify(array_tokens));

  boardgamesService.addPlayers(boardgameid, {players}).then(buscarBoardgame(boardgame.dados.boardgameid));
  //atualizar o boargame da sessão

  //Atualizar o Score dos pontos do nível na Sessão
  sessionStorage.setItem("score_round",score);

  //gravar na Log as resposta selecionadas
  const boardgame_id = boardgame.dados.boardgameid;
  const level = boardgame.dados.level;
  const hora = (new Date()).toLocaleTimeString('pt-BR');
  const data = (new Date()).toLocaleDateString('pt-BR');
  var log_answers = {user_UID: user_UID, data: data, hora: hora, level: level, boardgameid: boardgameid, rodada_id: boardgame_id, category: sessionStorage.question_category, question_numb:sessionStorage.question_numb, user_answer:sessionStorage.userAnswer, score_old: score_old, score_new: score, tokenid: sessionStorage.sessionStorage.token_quiz};
  // Salvar no banco de dados.
  logboardgamesService.save(log_answers);
}


function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "Tempo Restante"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns = sessionStorage.answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1; //upgrading time value with 1
    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    if (time > 549) {
      //if time value is greater than 549
      clearInterval(counterLine); //clear counterLine
    }
  }
}

function existQuiz(){
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
}


function fechar(){
    sessionStorage.removeItem('token_quiz');
    sessionStorage.removeItem('quiz');
    window.location.href = "../../play/menu.html";
}

function getAtualQuiz(){
  let quizString = sessionStorage.quiz;
  let quiz;
  if (quizString === undefined || quizString === "undefined"){
    quizString = setAtualQuiz();
  }else {
    quiz = JSON.parse(quizString);
    console.log(quiz);
  }
  return quiz;
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
