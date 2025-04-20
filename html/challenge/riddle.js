var activity; 
var user_UID; 
var group_id; // ground_control_point_id vinculdado ao riddle_id
var ground_control_point_id; // Será populado na função validaQRCode()
var ground_control_point_next; //Será populado na função validaQRCode()
var pos_ground_control_point; //Será populado na função validaQRCode()
var points;

const riddle_text = document.getElementById("riddle_text");
const riddle_attention = document.getElementById("riddle_attentio");
const riddle_location = document.getElementById("riddle_location");

firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    user_UID = User.uid; 
    const params = new URLSearchParams(window.location.search);
    activity_id = params.get('activity_id'); 
    checkin_ativities(activity_id, user_UID);
    first_point = params.get('first_point'); 
    if(first_point){
      ground_control_point_id = params.get('ground_control_point_id'); //OK
      pos_ground_control_point = params.get('pos_ground_control_point');
      ground_control_point_next = params.get('ground_control_point_next');
      group_id = params.get('group_id');
      first_QRCode(ground_control_point_id,group_id);
    }else{
      const riddle_id = params.get('riddle_id');
      const riddle = getRiddleByUID(riddle_id)
      showRiddle(riddle);
    }

  function showRiddle(riddle){
      let riddle_text_tag = `<span class="riddle_text">${riddle.text}</span>`;
      let riddle_attention_tag = `<span class="riddle_attention">${riddle.attention}</span>`;
      let riddle_location_tag = `<span class="riddle_location">${riddle.location}</span>`;
      riddle_text.innerHTML = `${riddle_text_tag}`;   
      riddle_attention.innerHTML = `${riddle_attention_tag}`;  
      riddle_location.innerHTML = `${riddle_location_tag}`;     
  }

  async function getRiddleByUID(ridle_id){
    return await riddleService.getRiddleByUID(ridle_id);
  }

  async function getRiddle(ground_control_point_id,group_id){
      let atual_riddle = null;
      const riddles = await riddleService.getRiddleByGroundControlPointId(ground_control_point_id, group_id);
      if (riddles.length == 1) {
        atual_riddle = riddles[0]; // Apenas o primeiro enigma
      }else{
        alert("problema no cadastro dos enigmas. Verificar com o administrador do evento!")
      }
      return atual_riddle;
  }

  async function first_QRCode(ground_control_point_id,group_id) {
      const riddle = getRiddle(ground_control_point_id,group_id); 
      setLogFirstQRCode(riddle.uid);
      showRiddle(riddle.dados);
  }

  async function checkin_ativities(activity_uid, user_UID) {
    const checkin_ativities = await checkinactivityService.getcheckinbyPlayer(activity_uid,user_UID);
      checkin_ativities.forEach(checkin_ativity =>{
        points = checkin_ativity.dados.points;
      })
      return checkin_ativities;
  }

  function setLogFirstQRCode(riddle_id){
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challenge";
      let type = "orienteering";
      let tokenid = qrcode;// orienteering_id
      let level = activity.level;
      let question_id = "";
      let points_new = points;
      let points_old = points; 

      var log_activities ={
        activity_uid,
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

function voltar(){
  window.location.href = "../play/menu.html?activity_id="+activity_id;
}