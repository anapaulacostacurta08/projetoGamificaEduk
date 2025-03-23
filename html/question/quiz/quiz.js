var question;
var activity;
var tokenid;
var user_uid;
var activity_uid;
var question_uid;

firebase.auth().onAuthStateChanged((User) => {
  const question_box = document.getElementById("question_box");
  const que_text = document.getElementById("que_text");
  const option_list = document.getElementById("option_list");
  const timeText = document.getElementById("time_left_txt");
  const timeCount = document.getElementById("timer_sec");
  //var quizzes;
  var player;

  if (!User) {
      window.location.href = "../login/login.html";
  }else{
      user_uid = User.uid;
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      tokenid = params.get('tokenid');
      activityService.getActivitybyUid(activity_uid).then((activityfind) => {
        activity = activityfind;
        var players = activityfind.players;
        players.forEach(playerfind => {
          if(playerfind.user_UID == User.uid){
              player = playerfind;      
          }
        })
       
        //Buscas as Questões a serem respondidas para a atividade de acorco com o nive e categoria.
        
      //quizzes = questions;
      //Verificar qual a pergunta que o jogador deverá respoder
      question_uid = getAtualQuiz();
      questionsService.findByUid(question_uid).then(question_find =>{
        question = question_find;
        //Verifica se o jogador já respondeu todas as perguntas
        if(question == null){
          alert("Não existe nenhum quiz para ser respondido!");
          window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
        }else{
          showQuestion();
          startTimer(30);
        }
      });
    });

   
    function showQuestion(){
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

    function getAtualQuiz(){
      let atual_quiz;
      let answered_quizzes = player.user_answered.quiz.questions;
      let quizzes_questions = activity.schedule.quiz.questions;
      let stop = quizzes_questions.length;
      for(i=0;i<stop;i++){
        if (answered_quizzes.indexOf(quizzes_questions[i]) == -1){ // Não foi respondida
          atual_quiz = quizzes_questions[i];
          i=stop;
        }
      }
      /**if(!(quizzes === undefined)){
        quizzes.forEach(quiz => {
          if(answered_quizzes.indexOf(quiz.numb) == -1){ //Não foi respondida
            atual_quiz = quiz;
          }
        });
      }**/
      return atual_quiz;
    }
  }
})

// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(answer) {
  let userAns = answer.querySelector(".choice-text").textContent; //getting user selected option
  let correct;
  const allOptions = option_list.children.length; //getting all option items
  if (userAns == question.answer[0]) {
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    correct = true;
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");
    correct = false;
  }
  
  for (i = 0; i < allOptions; i++) {
    if (option_list.children[i].textContent == question.answer[0]) {
      //if there is an option which is matched to an array answer
      option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
      option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
      console.log("Auto selected correct answer.");
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
  setPoints(correct, userAns);// Resposta correta e resposta marcada pelo jogador.
}

function setPoints(corret,  user_answer){
  let tmp_players = activity.players;
  let points_old;
  let points;
  let players = new Array();
  var last = tmp_players.length;
  var log_answers;
  for(i=0;i<last;i++){
    let timestamp = tmp_players[i].timestamp;
    points = tmp_players[i].points;

    let quiz_answered = new Array();
    let atual_quiz_answered = tmp_players[i].user_answered.quiz.questions;
    let last_quiz_answered = atual_quiz_answered.length;
    let user_UID = tmp_players[i].user_UID;
    for (j=0; j<last_quiz_answered;j++){
        quiz_answered[j] = atual_quiz_answered[j];
    }
    let tokens_quiz_used = new Array();
    let last_tokens_quiz = tmp_players[i].user_answered.quiz.tokens_used.length;
    let atual_tokens_quiz_used = tmp_players[i].user_answered.quiz.tokens_used;
    for (j=0; j<last_tokens_quiz;j++){
        tokens_quiz_used[j] = atual_tokens_quiz_used[j];
    }
    let bonus_answered = new Array();
    let atual_bonus_answered =  tmp_players[i].user_answered.bonus.questions;
    let last_bonus_answered = atual_bonus_answered.length;
    for (j=0; i<last_bonus_answered;j++){
      bonus_answered[j] = atual_bonus_answered[j];
    }
    let tokens_bonus_used = new Array();
    let atual_tokens_bonus_used = tmp_players[i].user_answered.bonus.tokens_used;
    for (j=0; i<atual_tokens_bonus_used.length;j++){
      tokens_bonus_used[j] = atual_tokens_bonus_used[j];
    }

    let luck_answered = new Array();
    let atual_luck_answered =  tmp_players[i].user_answered.luck.questions;
    for (j=0; i<atual_luck_answered.length;j++){
      luck_answered[j] = atual_luck_answered[j];
    }
    let tokens_luck_used = new Array();
    let atual_tokens_luck_used = tmp_players[i].user_answered.luck.tokens_used;
    for (j=0; i<atual_tokens_luck_used.length;j++){
      tokens_luck_used[j] = atual_tokens_luck_used[j];
    }

    let setback_answered = new Array();
    let atual_setback_answered =  tmp_players[i].user_answered.setback.questions;
    let last_setback = atual_setback_answered;
    for (j=0; i<last_setback;j++){
      setback_answered[j] = atual_setback_answered[j];
    }
    let tokens_setback_used = new Array();
    let atual_tokens_setback_used = tmp_players[i].user_answered.setback.tokens_used;
    for (j=0; i<atual_tokens_setback_used.length;j++){
      tokens_setback_used[j] = atual_tokens_setback_used[j];
    }

    let challange_answered = new Array();
    let atual_challange_answered =  tmp_players[i].user_answered.challange.questions;
    for (j=0; i<atual_challange_answered.length;j++){
      challange_answered[j] = atual_challange_answered[j];
    }

    let tokens_challange_used = new Array();
    let atual_tokens_challange_used = tmp_players[i].user_answered.challange.tokens_used;
    for (j=0; i<atual_tokens_challange_used.length;j++){
      tokens_challange_used[j] = atual_tokens_challange_used[j];
    }

    let quiz_final_answered = new Array();
    let atual_quiz_final_answered =  tmp_players[i].user_answered.quiz_final.questions;
    for (j=0; i<atual_quiz_final_answered.length;j++){
      quiz_final_answered[j] = atual_quiz_final_answered[j];
    }

    let tokens_quiz_final_used = new Array();
    let atual_tokens_quiz_final_used = tmp_players[i].user_answered.quiz_final.tokens_used;
    for (j=0; i<atual_tokens_quiz_final_used.length;j++){
      tokens_quiz_final_used[j] = atual_tokens_quiz_final_used[j];
    }

    if(tmp_players[i].user_UID == user_uid){
      points_old = tmp_players[i].points;
      //Atualizar os quizzes respondidos gravando o UID da questão.
      quiz_answered[last_quiz_answered] = question_uid;
      tokens_quiz_used[last_tokens_quiz] = tokenid;
      //Atualizar points
      if (corret){
        points = points_old + question.points;
      }else{
        points = points_old - question.lose_points;
      }
      timestamp = new Date().getTime();
      const hora = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let level = activity.level;
      let category =  question.category;
      let points_new = points;
      log_answers = {user_UID, data, hora, level, activity_uid, category, question_uid,  user_answer, points_old, points_new, tokenid};
    }

    let check_in = {date:tmp_players[i].ckeck_in.date,time:tmp_players[i].ckeck_in.time};
    let check_out = {date:tmp_players[i].ckeck_out.date,time:tmp_players[i].ckeck_out.time};
    let bonus = {questions:bonus_answered,tokens_used:tokens_bonus_used};
    let quiz = {questions:quiz_answered,tokens_used:tokens_quiz_used}; // Atualizado
    let luck = {questions:luck_answered,tokens_used:tokens_luck_used};
    let setback = {questions:setback_answered,tokens_used:tokens_setback_used};
    let challange = {questions: challange_answered,tokens_used:tokens_challange_used};
    let quiz_final = {questions:quiz_final_answered,tokens_used:tokens_quiz_final_used};
    let user_answered = {bonus, quiz,luck, setback, challange,quiz_final};
    players[i] = {user_UID,points,check_in,check_out, timestamp,user_answered};
  }
  //Gravar Dados
  activityService.update(activity_uid, {players});

  //gravar na Log as resposta selecionadas
  logactivitieService.save(log_answers);
}

function fechar(){
  window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
}
