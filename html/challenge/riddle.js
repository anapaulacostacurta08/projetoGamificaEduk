

const riddle_text = document.getElementById("riddle_text");
const riddle_attention = document.getElementById("riddle_attention");
const riddle_location = document.getElementById("riddle_location");
const btn_voltar_tag = document.getElementById("btn_voltar");

firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var user_UID; 
    var group_id; // ground_control_point_id vinculdado ao riddle_id
    var ground_control_point_id; // Será populado na função validaQRCode()
    var ground_control_point_next; //Será populado na função validaQRCode()
    var pos_ground_control_point; //Será populado na função validaQRCode()
    user_UID = User.uid; 
    const params = new URLSearchParams(window.location.search);
    var activity_id = params.get('activity_id'); 
    first_point = params.get('first_point');
    let level;
    activityService.getActivitybyUid(activity_id).then(Activity =>{
      let activity = Activity;
      if(validarValor(activity)){
        level = activity.level;
      } 
    });
    let points;
    const checkin_ativities = checkinactivityService.getcheckinbyPlayer(activity_id,user_UID);
      checkin_ativities.forEach(checkin_ativity =>{
        if(validarValor(points)){
          points = checkin_ativity.dados.points;
        }
    })  
    btn_voltar_tag.innerHTML = `<button class="badge bg-success p-2" onclick="voltar(${activity_id})" type="button">OK</button>`; 
    if(first_point){
      ground_control_point_id = params.get('ground_control_point_id'); //OK
      pos_ground_control_point = params.get('pos_ground_control_point');
      ground_control_point_next = params.get('ground_control_point_next');
      group_id = params.get('group_id');
      riddleService.getRiddleByGroundControlPointId(ground_control_point_next.trim(), group_id.trim()).then(riddles =>{
        showRiddle(riddles[0].dados);
        if(validarValor(level)){
          console.log(level);
        }
        setLogFirstQRCode(riddles[0].uid, activity_id, level, points)
      })
    }else{
      const riddle_id = params.get('riddle_id');
        riddleService.getRiddleByUID(riddle_id).then(riddle =>{
          showRiddle(riddle);
      })   
    }

    function validarValor(valor) {
      if (valor === null) {
        return false;
      }
      return true;
    }

  function showRiddle(riddle){
      let riddle_text_tag = `<span class="riddle_text"><img src="../../assets/images/key.png" width="30" height="30">${riddle.text}</span>`;
      let riddle_attention_tag = `<span class="riddle_attention"><img src="../../assets/images/alert.png" width="30" height="30"><strong>Mas atenção:</strong>${riddle.attention}</span>`;
      let riddle_location_tag = `<span class="riddle_location"><img src="../../assets/images/location.png" width="30" height="30">${riddle.location}</span>`;
      riddle_text.innerHTML = `${riddle_text_tag}`;   
      riddle_attention.innerHTML = `${riddle_attention_tag}`;  
      riddle_location.innerHTML = `${riddle_location_tag}`;     
  }

  function setLogFirstQRCode(riddle_id, activity_id, level, points){
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challenge";
      let type = "orienteering";
      let tokenid = group_id;// 
      //let level = activity.level;
      let question_id = "";
      let points_new = points;
      let points_old = points; 

      var log_activities ={
        activity_id,
        category, 
        type, 
        ground_control_point_id, // if orienteering para verificar o ponto de control passado
        pos_ground_control_point, // Ponto inicial
        ground_control_point_next, // proximo ponto de controle 
        group_id,
        data,
        time,
        level, 
        points_new, 
        points_old,
        question_id, 
        riddle_id,
        tokenid,
        user_UID
      };
      //gravar na Log as resposta selecionadas
      logActivityService.save(log_activities);
    } 
  }
})

function voltar(activity_id){
  window.location.href = `../play/menu.html?activity_id=${activity_id}`;
}