var question ;
var activity;
var tokenid;
var user_UID;
var activity_id;
var question_id;

const question_box = document.getElementById("question_box");
const que_text = document.getElementById("que_text");
const option_list = document.getElementById("option_list");
const timeText = document.getElementById("time_left_txt");
const timeCount = document.getElementById("timer_sec");

firebase.auth().onAuthStateChanged((User) => {
  if (User) {
      user_UID = User.uid;
      const params = new URLSearchParams(window.location.search);
      activity_id = params.get('activity_id');
      tokenid = params.get('tokenid');
      let points, level;
      activityService.getActivitybyUid(activity_id).then((activity_find) => {
        activity = activity_find;
        level = activity.level;
        checkinactivityService.getcheckinbyPlayer(activity_id, user_UID).then(checkin_ativities =>{
          if (checkin_ativities.length>0){
            points = checkin_ativities[0].dados.points;
            //Usuário realizou Ckeckin
            question_id = getAtualQuiz();
            if(!(question_id ==="")){
              questionsService.findByUid(question_id).then(question_find =>{
              question = question_find;
                //Verifica se o jogador já respondeu todas as perguntas
                if(question == null){
                  alert("Não existe nenhum quiz para ser respondido!");
                  window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
                }else{
                  showQuestion();
                  startTimer(30);
                }
              })
            }
          }
        })
    })
  

      function showQuestion(){
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
          option[i].setAttribute("onclick", "optionSelected(this)");
        }
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
      
      function getAtualQuiz(){
        let atual_quiz ="";
        let answered_quizzes = new Array();
        logActivityService.getAtivitityByUserUID(activity_id, user_UID).then(log_activities =>{
          activityTaskService.getTaskActivity(activity_id).then(activityTasks => {
            activityTasks.forEach(activityTask => {
              quizService.getQuizzesByUid(activityTask.dados.quizzes_id).then(quizzes =>{
                log_activities.forEach(log_activity =>{
                  if(log_activity.category === "quiz"){
                    let question = log_activity.question.id;
                    answered_quizzes.push(question);
                  }
                })
                quizzes.forEach(quiz =>{
                  let questions = quiz.questions;
                  questions.forEach(question =>{
                    if (answered_quizzes.indexOf(question) == -1){ //Se encontrado foi respondida. retorna -1 Não encontrado.
                      atual_quiz = question;
                      return atual_quiz;
                    }
                  })
                })
              })
            })
          })
        })
        return atual_quiz;
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
        setPoints(correct, userAns, level, points);// Resposta correta e resposta marcada pelo jogador.
      }
      
      function setPoints(corret,  user_answer, level, points){
        let points_old = points;
        let points_new;
        let level = activity.level;
        let category =  question.category;
        let type = question.type;
        const time = (new Date()).toLocaleTimeString('pt-BR');
        const data = (new Date()).toLocaleDateString('pt-BR');

      
        //Atualizar points
        if (corret){
          points_new = points_old + question.points;
        }else{
          points_new = points_old - question.lose_points;
        }

        var log_activities ={
          activity_id,
          category, //quiz
          type, //multiple
          data,
          time,
          level,
          group_id,
          question_id,
          points_new,
          points_old,
          tokenid,
          user_UID,
          user_answer
        };
        //gravar na Log as resposta selecionadas
        logActivityService.save(log_activities);
      }  
  }
});

function fechar(){
  window.location.href = "../../play/menu.html?activity_id="+activity_id;
}