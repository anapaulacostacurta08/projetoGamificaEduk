var list_players = document.getElementById("list_players");
list_players.style.display = 'none';

firebase.auth().onAuthStateChanged((User) => {
   if (User) {
      //user_UID = User.uid; 
      const params = new URLSearchParams(window.location.search);
      var activity_id = params.get('activity_id'); 
      var tokenid = params.get('tokenid'); 
      var type = params.get('type'); // orienteering
      //var activity = getActivity(activity_id); 
      var qrcode = params.get('qrcode'); //OK
      var orienteering_groups_id = params.get('orienteering_groups_id');
    

      //Verificar se o QRcode lido é o correto do caminho
      if(type === "orienteering"){
        logActivityService.getAtivitityByChallenge(activity_id, user_UID, "challenge", "orienteering").then(logs => {
          if(!(validarValor(logs))){
            list_players.style.display = 'block';
            popularJogadores();
          }else{
            window.location.href = `./${type}.html?activity_id=${activity_id}&orienteering_groups_id=${orienteering_groups_id}&qrcode=${qrcode}`;
          }
        })
      }else{ 
        if (question.type === "puzzle"){
          window.location.href = `./puzzle.html?activity_id=${activity_id}&tokeid=${tokenid}`;
        }else{
          //Desenvolver...
        }
      }

    document.getElementById("qrcode-form").addEventListener("submit", function(event) {
      event.preventDefault();
      let player2 = document.querySelector('.player2');
      let player2_uid = player2.id;
      window.location.href = `./${type}.html?activity_id=${activity_id}&orienteering_groups_id=${orienteering_groups_id}&player2_uid=${player2_uid}&qrcode=${qrcode}`;
    })
    
  }
})

function voltar(){
  window.location.href = "../play/menu.html?activity_id="+activity_id;
}

function popularJogadores() {
  firebase.auth().onAuthStateChanged((User) => {
      if (User) {
          let Players = document.getElementById("players");
          userService.findByUid(User.uid).then(user =>{
              userService.getPlayers(user.host).then(User2 =>{
                  Players.innerHTML = Players.innerHTML +`<option class="player2" value="${User2.uid}">${User2.name}</option>`;
              })
          })
      }
  })
}





