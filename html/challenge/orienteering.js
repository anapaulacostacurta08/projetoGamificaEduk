const que_text = document.getElementById("que_text");
const option_list = document.getElementById("option_list");
const timeText = document.getElementById("time_left_txt");
const timeCount = document.getElementById("timer_sec");

firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var question;
    var user_UID; //OK
    //var group_id; // ground_control_point_id vinculdado ao riddle_id
    //var ground_control_point_id; // Será populado na função validaQRCode()
    //var ground_control_point_next; //Será populado na função validaQRCode()
    //var pos_ground_control_point; //Será populado na função validaQRCode()
    //var points;
    user_UID = User.uid; //OK
    const params = new URLSearchParams(window.location.search);
    var activity_id = params.get('activity_id'); //OK
    var qrcode = params.get('qrcode'); //OK

    try{
      let ground_control_point = verificaQRcode(qrcode, activity_id, user_UID);
      if(!(validarValor(ground_control_point))){
        setLogQRCode(qrcode, true, activity_id);
        if(isChallenge(qrcode)){
          question = getAtualChallenge(activity_id);
          if(!(validarValor(question))){
            showOrienteering(activity_id, question);
            startTimer(30);
          }
        }
      }else{ // QRCode Incorreto, perde pontos.
        setLogQRCode(qrcode, false, activity_id);
      }
    }catch (error){
      alert("Erro ao buscar dados:", error);
    }

    async function verificaQRcode(qrcode, activity_id, user_UID) {
      await logActivityService.getAtivitityByChallenge(activity_id, user_UID, "challenge").then(logs => {
        if(validarValor(logs)){
          const answeredControlPoints = logs.map(log => ({
            qrcode: log.ground_control_point_id,
            pos_point: log.pos_ground_control_point,
            next_point: log.ground_control_point_next,
            group_id: log.group_id,
          }));
          // Caso o jogador já tenha respondido pontos
          if (answeredControlPoints.length > 0) {
            var group_id = answeredControlPoints[0].group_id;
            orienteeringService.getOrienteeringByGroupId(group_id).then(orienteering =>{
              if(validarValor(orienteering)){
                const pathway = orienteering.pathway;
                if(pathway.length > 0){
                  const currentQRIndex = pathway.indexOf(qrcode);
                  if (currentQRIndex === -1) {
                    alert("QRCode inválido: não pertence ao percurso.");
                    return null;
                  }
                  const lastAnsweredIndex = answeredControlPoints.length - 1;
                  const lastPointPosition = parseInt(answeredControlPoints[lastAnsweredIndex].pos_point);
                  const expectedNextPosition = lastPointPosition + 1;

                  if (currentQRIndex === expectedNextPosition) {
                    const expectedNextQR = answeredControlPoints[lastAnsweredIndex].next_point;
                    if (qrcode === expectedNextQR) {
                      // Atualiza controle de posição
                      const ground_control_point = {
                        ground_control_point_id: qrcode,
                        pos_ground_control_point: currentQRIndex,
                        ground_control_point_next: pathway[currentQRIndex + 1],
                        group_id: group_id,
                      };
                      alert("QRCode válido e na sequência correta.");
                      return ground_control_point;
                    } else {
                      alert("QRCode fora da sequência esperada.");
                      return null;
                    }
                  } else if (currentQRIndex < expectedNextPosition) {
                    alert("Este QRCode já foi utilizado.");
                    return null;
                  } else {
                    alert("QRCode fora da sequência esperada.");
                    return null;
                  }
                }else{
                  alert("Erro ao verificar ponto de control e buscar o PathWay.");
                  return null;
                }
              }
            });
          }
        } else {
          // Nenhum ponto foi respondido — tentativa de início
          var group_id = qrcode;
          orienteeringService.getOrienteeringByGroupId(group_id).then(orienteering =>{
            if(validarValor(orienteering)){
              let pathway = orienteering.pathway;
              if (pathway.length > 0) {
                // Atualiza controle de início
                const ground_control_point = {
                  ground_control_point_id: qrcode,
                  pos_ground_control_point: -1,
                  ground_control_point_next:  pathway[0],
                  group_id: qrcode,
                };
                alert("Primeiro QRCode válido.");
                return ground_control_point;
              } else {
                alert("Primeiro QRCode inválido. Início incorreto.");
                return null;
              }
            }
          })
        } 
      }).catch( (error) => {
        console.error("Erro ao obter atividades do log:", error.message);
        return null;
      })  
      }
    

    function validarValor(valor) {
      if (valor === null) {
        return false;
      }
      return true;
    }

    async function isChallenge(group_id){
      orienteeringService.getOrienteeringByGroupId(group_id).then(orienteering =>{
        if(!(validarValor(orienteering))){
          return orienteering.challenge;
        }
      })
    }

    async function getAtualChallenge(activity_id, group_id) {
      let answered_challenge = [];
        challengeService.getChallengesByGroupID(group_id).ther(challenges =>{
        for (const challenge of challenges) {
          // Verifica os logs do usuário para ver o que já foi respondido
          logActivityService.getAtivitityByChallenge(activity_id, user_UID, "challenge").then(log_activities =>{
            if (log_activities.length > 0) {
              // Se houver questões respondidas, salva quais foram
              var group_id = log_activities[0].group_id;
              log_activities.forEach(log_activity => {
                answered_challenge.push({
                  question: log_activity.question_id,
                });
              });

              for (const questionId of challenge.questions) {
                if (!answered_challenge.includes(questionId)) {
                  questionsService.findByUid(questionId).then(question =>{
                    if (question) {
                      const dados = question.dados;
                      const uid = questionId;
                      return {uid, dados}; // Primeira questão ainda não respondida
                    }
                  })
                }
              }

            } else {
              // Se nenhuma questão foi respondida, retorna apenas o enigma (riddle) inicial
              //Direcionar para riddle.html
              window.location.href = `./riddle.html?activity_id=${activity_id}&first_point=${true}&ground_control_point_id=${ground_control_point_id}&group_id=${group_id}&pos_ground_control_point=${-1}&ground_control_point_next=${ground_control_point_next}`;
            }
          })
        }   
        return null;      
      })      
    }

  function showOrienteering(activity_id, Question){
    let question = Question.dados;
    let que_tag = `<span class="fw-bold">${question.text}</span>`;
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
      option[i].setAttribute("onclick", `optionSelected(this,${activity_id},${Question})`);
    }
  }

  async function getActivity(activity_id) {
    return await activityService.getActivitybyUid(activity_id);
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

  // creating the new div tags which for icons
  let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
  let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

  //if user clicked on optionSelectedOrienteering
  function optionSelected(answer,activity_id,Question) {
      let question = Question.dados;
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
      let next_riddle = getNextRiddle();
      if(!(validarValor(next_riddle))){
        setLogActivityOrienteering(correct, next_riddle.uid, Question);
        if(correct){
          alert("Você Acertou! Parabens! Agora Fique atento ao Enigma para achar o próximo ponto!" );
        }else{
          alert("Que pena, você não acertou! Mas fique atento ao Enigma para achar o próximo ponto!" );
        }
        //showRiddle(riddle.dados);
        window.location.href = `./riddle.html?activity_id=${activity_id}&first_point=${false}&riddle_id=${riddle.uid}`;
      }
    }

    async function getNextRiddle(ground_control_point_next){
      await riddleService.getRiddleByGroundControlPointId(ground_control_point_next, group_id).then((riddles)=>{
        if (riddles.length == 1) {
          return riddles[0]; 
        }else{
          alert("Problema no cadastro dos enigmas. Verificar com o administrador do evento!")
          return null;
        }
      });
    }

    async function checkin_ativities(activity_id, user_UID) {
      return await checkinactivityService.getcheckinbyPlayer(activity_id,user_UID);
    }

    async function getPoints(activity_id) {
      const checkin_ativities = await checkinactivityService.getcheckinbyPlayer(activity_id,user_UID);
        checkin_ativities.forEach(checkin_ativity =>{
          return checkin_ativity.dados.points;
      })
    }


    function setLogActivityOrienteering(correct, riddle_id, question){
      let activity = getActivity(activity_uid); //OK
      let level = activity.level;
      let points = getPoints(activity_id);
      let points_old = 0;
      let points_new = 0;
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challenge";
      let type = "orienteering";
      let tokenid = qrcode;
      let question_id = question.uid;
      
      points_old = points;
      if(correct){
        points_new = points + question.dados.points;
      }else{
        points_new = points - question.dados.lose_points;
      }
      
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
        question_id,
        points_old,
        points_new, 
        riddle_id,
        tokenid,
        user_UID
      };
      //gravar na Log as resposta selecionadas
      logActivityService.save(log_activities);
    }

    function setLogQRCode(qrcode, correct, activity_id){
      let points = getPoints(activity_id);
      let activity = getActivity(activity_id); //OK
      let points_old = 0;
      let points_new = 0;
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challenge";
      let type = "qrcode";
      let tokenid = qrcode;// 
      let level = activity.level;

      points_old = points;
      if(correct){
        points_new = points + 10;
      }else{
        points_new = points - 5;
      }

      var log_activities ={
        activity_uid,
        category,
        type, 
        //ground_control_point_id, // if orienteering para verificar o ponto de control passado
        //pos_ground_control_point, // Ponto inicial
        //ground_control_point_next, // proximo ponto de controle 
        group_id,
        data,
        time,
        level, 
        //question_id,
        points_old,
        points_new, 
        //riddle_id,
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