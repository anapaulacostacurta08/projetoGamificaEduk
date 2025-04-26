const que_text = document.getElementById("que_text");
const option_list = document.getElementById("option_list");
const timeText = document.getElementById("time_left_txt");
const timeCount = document.getElementById("timer_sec");
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
var question;
var activity_id;
var user_UID; //OK
var ground_control_point;
var level;
var points;

firebase.auth().onAuthStateChanged((User) => {
  if (User) {    
    //var group_id; // ground_control_point_id vinculdado ao riddle_id
    //var ground_control_point_id; // Será populado na função validaQRCode()
    //var ground_control_point_next; //Será populado na função validaQRCode()
    //var pos_ground_control_point; //Será populado na função validaQRCode()
    //var points;
    user_UID = User.uid; //OK
    const params = new URLSearchParams(window.location.search);
    activity_id = params.get('activity_id'); //OK
    var qrcode = params.get('qrcode'); //OK
    level;
    activityService.getActivitybyUid(activity_id).then(activity =>{
      if(validarValor(activity)){
        level = activity.level;
      } 
    });
    points;
    checkinactivityService.getcheckinbyPlayer(activity_id,user_UID).then(checkin_ativities =>{
      checkin_ativities.forEach(checkin_ativity =>{
        if(validarValor(points)){
          points = checkin_ativity.dados.points;
        }
      })  
    })
    
    logActivityService.getAtivitityByChallenge(activity_id, user_UID, "challenge", "orienteering").then(logs => {
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
              const pathway = orienteering[0].pathway;
              if(pathway.length > 0){
                const currentQRIndex = pathway.indexOf(qrcode);
                if (currentQRIndex === -1) {
                  alert("QRCode inválido: não pertence ao percurso.");
                  //ground_control_point = null;
                  setLogQRCode(qrcode, false, activity_id, level, points, group_id);
                }else{
                    const lastAnsweredIndex = answeredControlPoints.length - 1;
                    const lastPointPosition = parseInt(answeredControlPoints[lastAnsweredIndex].pos_point);
                    const expectedNextPosition = lastPointPosition + 1;

                    if (currentQRIndex === expectedNextPosition) {
                      const expectedNextQR = answeredControlPoints[lastAnsweredIndex].next_point;
                      if (qrcode === expectedNextQR) {
                        // Atualiza controle de posição
                        ground_control_point = {
                          ground_control_point_id: qrcode,
                          pos_ground_control_point: currentQRIndex,
                          ground_control_point_next: pathway[currentQRIndex + 1].trim(),
                          group_id: group_id,
                        };
                        alert("QRCode válido e na sequência correta.");
                        setLogQRCode(qrcode, true, activity_id, level, points, group_id);
                        if(isChallenge(group_id)){
                          challengeService.getChallengesByGroupID(group_id).then(challenges =>{
                            let answered_challenge = [];
                            for (const challenge of challenges) {
                              // Verifica os logs do usuário para ver o que já foi respondido
                              logActivityService.getAtivitityByChallenge(activity_id, user_UID, "challenge", "orienteering").then(log_activities =>{
                                if ((log_activities.length ==1)){
                                  //var group_id = log_activities[0].group_id;
                                  if(log_activities[0].question_id === ""){
                                    const questionId = challenge.dados.questions[0]; 
                                    questionsService.findByUid(questionId).then(Question =>{
                                      const dados = Question;
                                      const uid =  questionId;
                                      question = {uid, dados}; // Primeira questão ainda não respondida\
                                      if(validarValor(question)){
                                        showOrienteering();
                                        startTimer(30);
                                      }
                                    })
                                  }
                                }else{
                                  if(log_activities.length > 0) {
                                    // Se houver questões respondidas, salva quais foram
                                    //var group_id = log_activities[0].group_id;
                                    log_activities.forEach(log_activity => {
                                      answered_challenge.push({
                                          question: log_activity.question_id,
                                      });
                                    });
                                    for (const questionId of challenge.dados.questions) {
                                      if (!answered_challenge.includes(questionId)) {
                                        questionsService.findByUid(questionId).then(Question =>{
                                          if (validarValor(Question)) {
                                            const dados = Question;
                                            const uid = questionId;
                                            question = {uid, dados}; // Primeira questão ainda não respondida\
                                              if(validarValor(question)){
                                                showOrienteering();
                                                startTimer(30);
                                              } 
                                          }
                                        })
                                      }
                                    }
                                  }
                                }
                              })
                            }         
                          })
                        }
                      } else {
                        alert("QRCode fora da sequência esperada.");
                        //ground_control_point = null;
                        setLogQRCode(qrcode, false, activity_id, level, points, group_id);
                      }
                    } else if (currentQRIndex < expectedNextPosition) {
                      alert("Este QRCode já foi utilizado.");
                      //ground_control_point = null;
                      setLogQRCode(qrcode, false, activity_id, level, points, group_id);
                    } else {
                      alert("QRCode fora da sequência esperada.");
                      //ground_control_point = null;
                      setLogQRCode(qrcode, false, activity_id, level, points, group_id);
                    }
                  }
                }else{
                  alert("Erro ao verificar ponto de control e buscar o PathWay.");
                  //ground_control_point = null;
                  setLogQRCode(qrcode, false, activity_id, level, points, group_id);
                }
              }
          });
        }
      } else {
          // Nenhum ponto foi respondido — tentativa de início
          var group_id = qrcode;
          orienteeringService.getOrienteeringByGroupId(group_id).then(orienteering =>{
            if(validarValor(orienteering)){
              let pathway = orienteering[0].pathway;
              if (pathway.length > 0) {
                // Atualiza controle de início
                ground_control_point = {
                  ground_control_point_id: qrcode.trim(),
                  pos_ground_control_point: -1,
                  ground_control_point_next:  pathway[0].trim(),
                  group_id: qrcode.trim(),
                };
                alert("Primeiro QRCode válido. Você será direcionado para dica do seu primeiro ponto de controle...");
                window.location.href = `./riddle.html?activity_id=${activity_id}&first_point=${true}&ground_control_point_id=${ground_control_point.ground_control_point_id}&group_id=${ground_control_point.group_id}&pos_ground_control_point=${ground_control_point.pos_ground_control_point}&ground_control_point_next=${ground_control_point.ground_control_point_next}`;
              } else {
                alert("Primeiro QRCode inválido. Início incorreto.");
                //ground_control_point = null;
                setLogQRCode(qrcode, false, activity_id, level, points, group_id);
              }
            }
          })
        }
    })
  

    async function isChallenge(group_id){
      orienteeringService.getOrienteeringByGroupId(group_id).then(orienteering =>{
        if(validarValor(orienteering)){
          return orienteering.challenge;
        }
      })
    }

  function showOrienteering(){
    let que_tag = `<span class="fw-bold">${question.dados.text}</span>`;
    let option_tag = 
    '<div class="option"><span class="choice-prefix m-2 p-2">A</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="1"><span class="question">' +
      question.dados.options[0] +
      "</span></span></div>"+
      '<div class="option"><span class="choice-prefix m-2 p-2">B</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="2"><span class="question">' +
      question.dados.options[1] +
      "</span></span></div>" +
      '<div class="option"><span class="choice-prefix m-2 p-2">C</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="3"><span class="question">' +
      question.dados.options[2] +
      "</span></span></div>" +
      '<div class="option"><span class="choice-prefix m-2 p-2">D</span><span class="choice-text card m-2 p-2" style="width:380px" data-number="4"><span class="question">' +
      question.dados.options[3] +
      "</span></span></div>";
    
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
  
    const option = option_list.querySelectorAll(".option");
    // set onclick attribute to all available options
    for (i = 0; i < option.length; i++) {
      option[i].setAttribute("onclick", `optionSelected(this)`);
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
  
  

   function setLogQRCode(qrcode, correct, activity_id, level, points, group_id){
      let points_old;
      let points_new;
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challenge";
      let type = "qrcode";
      let tokenid = qrcode;// 
      //let level = activity.level;

      points_old = points;
      if(correct){
        points_new = points + 10;
      }else{
        points_new = points - 5;
      }

      var log_activities ={
        activity_id,
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

function validarValor(valor) {
  if (valor === null) {
    return false;
  }
  return true;
}

//if user clicked on optionSelectedOrienteering
function optionSelected(answer) {
  firebase.auth().onAuthStateChanged((User) => {
      if (User) {
      let userAns = answer.querySelector(".choice-text").textContent; //getting user selected option
      let correct;
      const allOptions = option_list.children.length; //getting all option items
      if (userAns == question.dados.answer) {
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
        if (option_list.children[i].textContent == question.dados.answer[0]) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      let next_riddle;
      riddleService.getRiddleByGroundControlPointId(ground_control_point.ground_control_point_next, ground_control_point.group_id).then((riddles)=>{
        if(validarValor(riddles)){
          if (riddles.length == 1) {
            next_riddle = riddles[0];
          }
        }
        if(validarValor(next_riddle)){
          setLogActivityOrienteering(correct, next_riddle.uid);
          if(correct){
            alert("Você Acertou! Parabens! Agora segue a dica para achar o próximo ponto!" );
          }else{
            alert("Que pena, você não acertou! Agora segue a dica achar o próximo ponto!" );
          }
          //showRiddle(riddle.dados);
          window.location.href = `./riddle.html?activity_id=${activity_id}&first_point=${false}&riddle_id=${next_riddle.uid}`;
        }
      })
    }
  })
}

function setLogActivityOrienteering(correct, riddle_id){
  firebase.auth().onAuthStateChanged((User) => {
    if (User) {
      //let level = activity.level;
      let points_old = 0;
      let points_new = 0;
      const time = (new Date()).toLocaleTimeString('pt-BR');
      const data = (new Date()).toLocaleDateString('pt-BR');
      let category = "challenge";
      let type = "orienteering";
      let tokenid = ground_control_point.ground_control_point_id;
      let question_id = question.uid;
      let ground_control_point_id = ground_control_point.ground_control_point_id;
      let pos_ground_control_point = ground_control_point.pos_ground_control_point;
      let ground_control_point_next = ground_control_point.ground_control_point_next;
      let group_id = ground_control_point.group_id;
      
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
  })
}
