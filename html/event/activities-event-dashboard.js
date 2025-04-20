

firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    const started_activities_list = document.getElementById("started_activities_list");
    const finished_activities_list = document.getElementById("finished_activities_list");
    const params = new URLSearchParams(window.location.search);
    var event_id = params.get('event_id');
    activityService.getActivitiesbyEventUID(event_id).then((activities) => {
      activities.forEach(activity => {
        checkinactivityService.getcheckinbyPlayer(activity.uid,User.uid).then(checkin_ativities =>{
          checkin_ativities.forEach(checkin_ativity => {
            let card_activity = `<span class="activity_dados" id="${activity.uid}">${activity.dados.name}</span>`;
            let periodo = `<span id="data_time_start">Inicio:${activity.dados.date_start} - ${activity.dados.time_start} - Fim: ${activity.dados.date_final} - ${activity.dados.time_final}</span>`;
            let card_points = `<span id="points" class="col-sm-3 ml-auto">`+
              `<span class="badge rounded-pill bg-info border border-2 border-dark p-1 m-1">`+
                  `<span id="score" class="badge bg-light text-dark border border-2 border-dark">${checkin_ativity.dados.points}</span>&nbsp;PONTOS`+
              `</span>`+
            `</span>`;
            let btn_activity = `<button type="button" class="btn btn-primary rounded-pill" onclick="cardActiveSelected(${activity.uid})">Entrar</span>`
            if (activity.dados.state === "started"){
              started_activities_list.innerHTML = started_activities_list.innerHTML +`<div class="card">${card_activity}${periodo}${card_points}${btn_activity}</div>`;
            }
            if (activity.dados.state === "finished"){
              finished_activities_list.innerHTML = finished_activities_list.innerHTML +`<div class="card">${card_activity}${periodo}${card_points}${btn_activity}</div>`;
            }
          })
        })          
      })
    })  
  }
})


function cardActiveSelected(activity_ID) {
  let activity_id = activity_ID;
  firebase.auth().onAuthStateChanged((User) => {
    if (User) {
      let date = new Date();
      activityService.getActivitybyUid(activity_id).then((activity) => {
        let data_start = activity.date_start.split("/");
        let time_start = activity.time_start.split(":");
        let data_time_start = new Date(data_start[2],data_start[1]-1,data_start[0],time_start[0],time_start[1]);
        let data_final = activity.date_final.split("/");
        let time_final = activity.time_final.split(":");
        let data_time_final = new Date(data_final[2],data_final[1]-1,data_final[0],time_final[0],time_final[1]);
        if(date >= data_time_start &&  date <= data_time_final){    
          alert('Retornando para o Jogo!');
          window.location.href = "../play/menu.html?activity_id="+activity_id;
        }else{
          msg_error.innerHTML= "Atividade fora do prazo!";
          alert_error.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        }
      })
    }
  })
}

//if user clicked on card
function cardClosedSelected(activityuid) {
  let activity_id = activityuid.id;
  alert("em desenvolvimento!");
}