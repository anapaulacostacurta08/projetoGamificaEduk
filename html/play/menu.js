var activity_id;
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    const main_menu = document.getElementById("main_menu");
    const params = new URLSearchParams(window.location.search);
    activity_id = params.get('activity_id');
    activityService.getActivitybyUid(activity_id).then((activity) => {
      let menu = ``;
      activityTaskService.getTaskActivity(activity_id).then(activity_tasks => {
        if(!(activity_tasks.length == 0)){
          activity_tasks.forEach(activity_task => {
            activityContentsService.getContentsActivity(activity_id).then(activity_contents =>{
              activity_contents.forEach(activity_content =>{
                if (!(activity_content.dados.all_viewed)){
                  menu = menu +`<p><button type="button" class="badge bg-primary p-2" id="btnConteudo" onclick="btnConteudo()">CONTEÚDO</button></p>`;
                }
                if (!(activity_task.dados.quizzes_id==="")){
                  menu = menu +`<p><button type="button" class="badge bg-primary p-2 btnQuiz" id="${activity_task.dados.quizzes_id}" onclick="btnQuiz()">QUIZ</button></p>`;
                }
                if(!(activity_task.dados.challenge_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2 btnDesafio" id="${challenge_id}" onclick="btnDesafio()">DESAFIO</button></p>`;
                }
                if(!(activity_task.dados.orienteering_groups_id==="")) {
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2 btnOrientacao" id="${activity_task.dados.orienteering_groups_id}" onclick="btnOrientacao()">ORIENTAÇÃO</button></p>`;
                }
                if( (!(activity_task.dados.good_fortune_id==="")) && (!(activity_task.dados.tough_luck_id==="")) ){
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2 btnSorteouReves" id="${activity_task.dados.good_fortune_id};${activity_task.dados.tough_luck_id}" onclick="btnSorteouReves()">SORTE OU REVÉS</button></p>`;
                }
                if (!(activity_task.dados.bonus_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-warning p-2 btnBonus" id="${activity_task.dados.bonus_id}" onclick="btnBonus()">TAREFAS</button></p>`; 
                }       
                if(!(activity_task.dados.quiz_final_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-success p-2 border border-2 border-dark btnQuizfinal" id="${activity_task.dados.quiz_final_id}" onclick="btnQuizfinal()">QUIZ FINAL</button></p>`;
                }
                main_menu.innerHTML = menu;         
                document.getElementById("level").innerHTML = activity.level;
                checkinactivityService.getcheckinbyPlayer(activity_id,User.uid).then(checkin_ativities =>{
                  checkin_ativities.forEach(checkin_ativity => {
                    document.getElementById("points").innerHTML = checkin_ativity.dados.points;
                  })
                })
              })
            })
          })
        }else{
          menu = "Nenhuma atividade cadastrada. Entre em contato com Adminsitrador do Evento!";
        }
      })
    })

  }
});

function btnQuiz() {
  let botao = document.querySelector('.btnQuiz');
  let quizzes_id = botao.id;
  window.location.href = `../token/token.html?category=quiz&quizzes_id=${quizzes_id}&activity_id=${activity_id}`;
}

function btnConteudo() {
  window.location.href = "../content/content.html?activity_id="+activity_id;
}

function btnDesafio() {
  let botao = document.querySelector('.btnDesafio');
  let challenge_id = botao.id;
  window.location.href = `../token/token.html?category=challenge&challenge_id=${challenge_id}&activity_id=${activity_id}`;
}

function btnOrientacao() {
  let botao = document.querySelector('.btnOrientacao');
  let orienteering_groups_id = botao.id;
  window.location.href = `../qrcode/scan_qrcode?category=challenge&type=orienteering&orienteering_groups_id=${orienteering_groups_id}&activity_id=${activity_id}`;
}

function btnSorteouReves() {
  let botao = document.querySelector('.btnSorteouReves');
  let btn_id = botao.id;
  const btn_sorte_reves = btn_id.split(';');
  let good_fortune_id = btn_sorte_reves[0];
  let tough_luck_id = btn_sorte_reves[1];
  window.location.href = `../token/token.html?category=good_fortune&good_fortune_id=${good_fortune_id}&tough_luck_id=${tough_luck_id}&activity_id=${activity_id}`;
}

function btnBonus(){
  let botao = document.querySelector('.btnBonus');
  let bonus_id = botao.id;
  window.location.href = `../token/token.html?category=bonus&bonus_id=${bonus_id}activity_id=${activity_id}`;
}

function btnQuizfinal(){
  let botao = document.querySelector('.btnQuizfinal');
  let quiz_final_id = botao.id;
  window.location.href = `../token/token.html?category=quiz_final&quiz_final_id=${quiz_final_id}&activity_id=${activity_id}`;
}

