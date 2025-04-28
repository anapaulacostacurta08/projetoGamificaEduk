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
                if (activity_content.dados.all_viewed){
                  menu = menu +`<p><button type="button" class="badge bg-primary p-2" id="btnConteudo" onclick="btnConteudo()">CONTEÚDO</button></p>`;
                }
                if (!(activity_task.dados.quizzes_id==="")){
                  menu = menu +`<p><button type="button" class="badge bg-primary p-2" id="btnQuiz" onclick="btnQuiz()">QUIZ</button></p>`;
                }
                if(!(activity_task.dados.challenge_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnDesafio" onclick="btnDesafio()">DESAFIO</button></p>`;
                }
                if(!(activity_task.dados.orienteering_id==="")) {
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnOrientacao" onclick="btnOrientacao()">ORIENTAÇÃO</button></p>`;
                }
                if( (!(activity_task.dados.good_fortune_id==="")) && (!(activity_task.dados.tough_luck_id==="")) ){
                  menu = menu + `<p><button type="button" class="badge bg-primary p-2" id="btnSorte" onclick="btnSorteouReves()">SORTE OU REVÉS</button></p>`;
                }
                if (!(activity_task.dados.bonus_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-warning p-2" id="btnTarefas" onclick="btnBonus()">TAREFAS</button></p>`; 
                }       
                if(!(activity_task.dados.quiz_final_id==="")){
                  menu = menu + `<p><button type="button" class="badge bg-success p-2 border border-2 border-dark" id="btnQuizfinal" onclick="btnQuizfinal()">QUIZ FINAL</button></p>`;
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
  window.location.href = "../token/token.html?category=quiz&activity_id="+activity_id;
}

function btnConteudo() {
  window.location.href = "../content/content.html?activity_id="+activity_id;
}

function btnDesafio() {
  window.location.href = "../token/token.html?category=challenge&activity_id="+activity_id;
}

function btnOrientacao() {
  window.location.href = "../qrcode/scan_qrcode?category=challenge&type=orienteering&activity_id="+activity_id;
}

function btnSorteouReves() {
  window.location.href = "../token/token.html?category=good_fortune&activity_id="+activity_id;
}

function btnBonus(){
  window.location.href = "../token/token.html?category=bonus&activity_id="+activity_id;
}

function btnQuizfinal(){
  window.location.href = "../token/token.html?category=quiz_final&activity_id="+activity_id;
}

