
firebase.auth().onAuthStateChanged((User) => {
  const que_text = document.getElementById("que_text");
  const option_list = document.getElementById("option_list");
  const timeText = document.getElementById("time_left_txt");
  const timeCount = document.getElementById("timer_sec");
  const btn_voltar_tag = document.getElementById("btn_voltar");
  //var question;
  //var user_UID; //OK
   if (User) {
      //user_UID = User.uid; 
      const params = new URLSearchParams(window.location.search);
      var activity_id = params.get('activity_id'); 
      var tokenid = params.get('tokenid'); 
      var type = params.get('type'); 
      var activity = getActivity(activity_id); 
      var qrcode = params.get('qrcode'); //OK
      btn_voltar_tag.innerHTML = `<button class="badge bg-success p-2" onclick="voltar(${activity_id})" type="button">VOLTAR</button>`;
      //Verificar se o QRcode lido é o correto do caminho
      if(type === "orienteering"){
        window.location.href = `./orienteering.html?activity_id=${activity_id}&qrcode=${qrcode}`;
      }else{ 
        if (question.type === "puzzle"){
          window.location.href = `./puzzle.html?activity_id=${activity_id}&tokeid=${tokenid}`;
        }else{
          //Desenvolver...
        }
      }

      async function getActivity(activity_id) {
        return activity = await activityService.getActivitybyUid(activity_id);
      }
       
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

  }
})

function voltar(activity_id){
  window.location.href = "../play/menu.html?activity_id="+activity_id;
}



