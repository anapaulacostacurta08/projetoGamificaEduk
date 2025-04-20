var activity_uid;
firebase.auth().onAuthStateChanged( (User) => {
  if (User){
    var type = ``;
    var question;
    var activity;
    var tokenid;
    var user_UID = User.uid;
    var question_uid;
    var player;
    const que_text = document.getElementById("que_text");
    const que_points = document.getElementById("que_points");
    const params = new URLSearchParams(window.location.search);
    activity_id = params.get('activity_id');
    tokenid = params.get('tokenid');
    type = params.get('type');
    activityService.getActivitybyUid(activity_uid).then((activities) => {
      activities.forEach(activityfind =>{
        activity = activityfind;
        playerService.getPlayerByActivity(activity_uid,User.uid).then(players =>{
          players.forEach(playerfind => {
              if(playerfind.dados.user_UID == User.uid){
                  player = playerfind;      
              }
          })
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
      let points_old = player.dados.points;
      let points;
      var log_answers;
      
      let luck_answered = new Array();
      let atual_luck_answered =  player.dados.luck_answered;
      let last_luck = atual_luck_answered.length;
      for (j=0; i< last_luck;j++){
        luck_answered[j] = atual_luck_answered[j];
      }
      let tokens_luck_used = new Array();
      let atual_tokens_luck_used = player.dados.luck_tokens_used;
      let last_tokens_luck_used = atual_tokens_luck_used.length;
      for (j=0; i<last_tokens_luck_used;j++){
        tokens_luck_used[j] = atual_tokens_luck_used[j];
      }
      let setback_answered = new Array();
      let atual_setback_answered =  player.dados.setback_answered;
      let last_setback = atual_setback_answered;
      for (j=0; i<last_setback;j++){
        setback_answered[j] = atual_setback_answered[j];
      }
      let tokens_setback_used = new Array();
      let atual_tokens_setback_used = player.dados.setback_tokens_used;
      let last_tokens_setback_used = atual_tokens_setback_used.length;
      for (j=0; i<last_tokens_setback_used;j++){
        tokens_setback_used[j] = atual_tokens_setback_used[j];
      }

      //Atualizar os quizzes respondidos gravando o UID da questão.
      if(type ==="SORTE"){
        luck_answered[last_luck] = question_uid;
        tokens_luck_used[last_tokens_luck_used] = tokenid;
      }
      if(type ==="REVÉS"){
        setback_answered[last_setback] = question_uid;
        tokens_setback_used[last_tokens_setback_used]=tokenid;
      } 
      //Atualizar points
      if (corret){
        points = points_old + question.points;
      }else{
        points = points_old - question.lose_points;
      }
      timestamp = new Date().getTime();
      const hora = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let level = activity.dados.level;
      let category =  question.category;
      let points_new = points;
      log_answers = {user_UID, data, hora, level, activity_uid, category, question_uid,  user_answer, points_old, points_new, tokenid};

      const luck = {
        luck_answered,
        tokens_luck_used,
        points,
        timestamp,
      };
      const setback = {
        setback_answered,
        tokens_setback_used,
        points,
        timestamp,
      };
      if(type ==="SORTE"){
        const players = luck;
        playerService.update(player.uid, players);
      }
      if(type ==="REVÉS"){
        const players = setback;
        playerService.update(player.uid, players);
      }
    
      //gravar na Log as resposta selecionadas
      logActivityService.save(log_answers);
    }

    function getAtualLuck(){
      let atual_luck;
      let answered_lucks = player.dados.luck_answered;
      let lucks_questions = activity.dados.schedule.luck.questions;
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
      let answered_setback = player.dados.setback_answered;
      let setback_questions = activity.dados.schedule.setback.questions;
      let stop = setback_questions.length;
      for(i=0;i<stop;i++){
        if (answered_setback.indexOf(setback_questions[i]) == -1){ // Não foi respondida
          atual_setback = setback_questions[i];
          i=stop;
        }
      }
      return atual_setback;
    }
  }
});

function fechar(){
  window.location.href = "../play/menu.html?activity_id="+activity_id;
}