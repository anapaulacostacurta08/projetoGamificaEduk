var type = ``;
var question;
var activity;
var tokenid;
var user_uid;
var activity_uid;
var question_uid;
const que_text = document.getElementById("que_text");
const que_points = document.getElementById("que_points");

firebase.auth().onAuthStateChanged( (User) => {
  if (User){
    const params = new URLSearchParams(window.location.search);
    activity_uid = params.get('activity_uid');
    tokenid = params.get('tokenid');
    type = params.get('type');
    activityService.getActivitybyUid(activity_uid).then((activityfind) => {
      activity = activityfind;
    
      if(type ==="SORTE"){
        question_uid = getAtualLuck();
      }
      if(type ==="REVÉS"){
        question_uid = getAtualSetback();
      }

      questionsService.findByUid(question_uid).then(question_find =>{
        question = question_find;
        showQuestion();
          
      
      })

    });

    function showQuestion(){
      let que_tag = `<span class="fw-bold">${question.pre_text}</span><br/><span class="fw-bold">${question.text}</span>`;
      let que_luck = `<span class="fw-bold">${question.points}</span>`;
      let que_setback = `<span class="fw-bold">${question.lose_points}</span>`;
      
      que_text.innerHTML = que_tag; //adding new span tag inside que_tag
      if(type ==="SORTE"){
        que_points.innerHTML = que_luck;
      }
      if(type ==="REVÉS"){
        que_points.innerHTML = que_setback;
      }; 
      setPoints();
    }

    function setPoints(){
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
        let user_UID = tmp_players[i].user_UID;
        for (j=0; j<atual_quiz_answered.length;j++){
            quiz_answered[j] = atual_quiz_answered[j];
        }
        let tokens_quiz_used = new Array();
        let atual_tokens_quiz_used = tmp_players[i].user_answered.quiz.tokens_used;
        for (j=0; j<atual_tokens_quiz_used.length;j++){
            tokens_quiz_used[j] = atual_tokens_quiz_used[j];
        }
        let bonus_answered = new Array();
        let atual_bonus_answered =  tmp_players[i].user_answered.bonus.questions;
        for (j=0; i<atual_bonus_answered.length;j++){
          bonus_answered[j] = atual_bonus_answered[j];
        }
        let tokens_bonus_used = new Array();
        let atual_tokens_bonus_used = tmp_players[i].user_answered.bonus.tokens_used;
        for (j=0; i<atual_tokens_bonus_used.length;j++){
          tokens_bonus_used[j] = atual_tokens_bonus_used[j];
        }
    
        let luck_answered = new Array();
        let atual_luck_answered =  tmp_players[i].user_answered.luck.questions;
        let last_luck = atual_luck_answered.length;
        for (j=0; i< last_luck;j++){
          luck_answered[j] = atual_luck_answered[j];
        }
        let tokens_luck_used = new Array();
        let atual_tokens_luck_used = tmp_players[i].user_answered.luck.tokens_used;
        let last_tokens_luck_used = atual_tokens_luck_used.length;
        for (j=0; i<last_tokens_luck_used;j++){
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
        let last_tokens_setback_used = atual_tokens_setback_used.length;
        for (j=0; i<last_tokens_setback_used;j++){
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
          if(type ==="SORTE"){
            luck_answered[last_luck] = question_uid;
            tokens_luck_used[last_tokens_luck_used] = tokenid;
          }
          if(type ==="REVÉS"){
            setback_answered[last_setback] = question_uid;
            tokens_setback_used[last_tokens_setback_used]=tokenid;
          }; 
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
        let quiz = {questions:quiz_answered,tokens_used:tokens_quiz_used}; 
        let luck = {questions:luck_answered,tokens_used:tokens_luck_used};
        let setback = {questions:setback_answered,tokens_used:tokens_setback_used};
        let challange = {questions: challange_answered,tokens_used:tokens_challange_used};
        let quiz_final = {questions:quiz_final_answered,tokens_used:tokens_quiz_final_used};
        let user_answered = {bonus, quiz, luck,  setback, challange,quiz_final};
        players[i] = {user_UID,points,check_in,check_out, timestamp,user_answered};
      }
      //Gravar Dados
      activityService.update(activity_uid, {players});
    
      //gravar na Log as resposta selecionadas
      logactivitieService.save(log_answers);
    }

    function getAtualLuck(){
      let atual_luck;
      let answered_lucks = player.user_answered.luck.questions;
      let lucks_questions = activity.schedule.luck.questions;
      let stop = lucks_questions.length;
      for(i=0;i<stop;i++){
        if (answered_lucks.indexOf(lucks_questions[i]) == -1){ // Não foi respondida
          atual_luck = lucks_questions[i];
          i=stop;
        }
      }
      return atual_luck;
    }

    

    function getAtualSetback(){
      let atual_setback;
      let answered_setback = player.user_answered.setback.questions;
      let setback_questions = activity.schedule.setback.questions;
      let stop = setback_questions.length;
      for(i=0;i<stop;i++){
        if (answered_setback.indexOf(setback_questions[i]) == -1){ // Não foi respondida
          atual_luck = setback_questions[i];
          i=stop;
        }
      }
      return atual_setback;
    }
  }
});

function fechar(){
  window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
}