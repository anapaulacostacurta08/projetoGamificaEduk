//const question_box = document.querySelector(".question_box");
const question_box = document.getElementById("question_box");
//const que_text = document.querySelector(".que_text");
const que_text = document.getElementById("que_text");
//const option_list = document.querySelector(".option_list");
const option_list = document.getElementById("option_list");
//const timeText = document.querySelector(".timer .time_left_txt");
const timeText = document.getElementById("time_left_txt");
//const timeCount = document.querySelector(".timer .timer_sec");
const timeCount = document.getElementById("timer_sec");
var user_UID = sessionStorage.userUid;
var User = getUser();
getProfile();

const boardgame = getBoardgame();

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
}

function showQuestion(question){
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag = "<span>" +  question.numb +".</span>"+"<span>" +  question.text +"</span>";
  let option_tag = 
  '<div class="option"><p class="choice-prefix">A</p><p class="choice-text" data-number="1"><span class="question">' +
    question.options[0] +
    "</span></div>" +
    '<div class="option"><p class="choice-prefix">B</p><p class="choice-text" data-number="2"><span class="question">' +
    question.options[1] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">C</p><p class="choice-text" data-number="3"><span class="question">' +
    question.options[2] +
    "</span></p></div>" +
    '<div class="option"><p class="choice-prefix">D</p><p class="choice-text" data-number="4"><span class="question">' +
    question.options[3] +
    "</span></p></div>";
  
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
  const allOptions = option_list.children.length; //getting all option items
  sessionStorage.setItem("userAnswer",userAns);

  if (userAns == correcAns) {
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    setScore(true);
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");
    setScore(false);
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
  //Atualizar no banco de dados
  boardgamesService.addPlayers(boardgameid, {players});
  //Atualizar Sessão
  sessionStorage.setItem("score_round",score);

  //Log da resposta
  const boardgame_id = boardgame.boardgameid;
  const level = boardgame.level;
  const hora = (new Date()).toLocaleTimeString('pt-BR');
  const data = (new Date()).toLocaleDateString('pt-BR');
  var log_answers = {user_UID: user_UID, data: data, hora: hora, level: level, boardgame_id: boardgame_id, category: sessionStorage.question_category, question_numb:sessionStorage.question_numb, user_answer:sessionStorage.userAnswer, score_old: score_old, score_new: score, tokenid: sessionStorage.token};
  // Salvar no banco de dados.
  logboardgamesService.save(log_answers);
}

function setBoardGame(boardgame){
  let boardgameString = JSON.stringify(boardgame);
  sessionStorage.setItem('boardgame', boardgameString);
}

function getBoardgame(){
  let boardgameString = sessionStorage.boardgame;
  let boardgame = JSON.parse(boardgameString);
  console.log(boardgame);
  return boardgame;
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
      timeText.textContent = "Intervalo"; //change the time text to time off
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