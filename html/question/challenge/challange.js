sessionStorage.setItem('haschallenge',true);

let haschallange;
if (sessionStorage.haschallange === undefined) {
  sessionStorage.setItem("haschallange",true);
}else{
  if(sessionStorage.haschallange == "true"){
    haschallange = true;
  }else{
    haschallange = false;
  }
}
//Buscar challanges e colocar na sessão;
var challanges = getChallanges();

const challange = getAtualChallange();

if(haschallange){
    showQuestion(quiz);
    startTimer(15);
}else{
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('challenge');
    sessionStorage.removeItem('answer');
    window.location.href = "../../play/menu.html";
}

function getChallanges(){
    var challangeString = sessionStorage.challanges;
    var challenges;
    if (challangeString  === undefined){
      questionsService.getQuizzesByLevel(parseInt(sessionStorage.level),"challenge").then(questions =>{
        console.log(questions);
        setChallenges(questions);
      });
    }else{
      challenges = JSON.parse(challangeString);
      console.log(challenges);
    }
    return challenges;
}

function setAtualChallenge(){
    let answered_challenges = getAnsweredChallenges();
    let challengeString;
    let answerString;
    let typeString;
    let numbString;
    //buscar as questões da sessão
    challenges.forEach(challenge => {
      if(answered_challenges.indexOf(challenge.numb) == -1){ //Não foi respondida
        challengeString = JSON.stringify(challenge);
        answerString = challenge.answer[0];
        typeString = challenge.type;
        numbString = challenge.numb;
      }
    });
    //Coloca quiz atual na sessão.
      sessionStorage.setItem('challenge', challengeString);
      sessionStorage.setItem('answer',answerString);
      sessionStorage.setItem('question_numb',numbString);
      sessionStorage.setItem('question_type',typeString);
      return challengeString;
}

function setChallenges(questions){
    // Convert the user object into a string
    let challengesString = JSON.stringify(questions);
    // Store the stringified object in sessionStorage
    sessionStorage.setItem('challenges', challengesString);
    sessionStorage.setItem('answered_challenges', JSON.stringify(new Array()));
}

function getAnsweredChallenges(){
  // Get the stringified object from sessionStorage
  let answered_ChallengesString = sessionStorage.answered_challenges;
    // Parse the string back into an object
  let answered_challenges = JSON.parse(answered_ChallengesString);
  console.log(answered_challenges);
  return answered_challenges;
}

function getAtualChallenge(){
  let challengeString = sessionStorage.challenge;
  let challenge;
  if (challengeString === undefined || challengeString === "undefined"){
    challengeString = setAtualQuiz();
  }
  if(challengeString === undefined || challengeString === "undefined"){
    sessionStorage.setItem('haschallange',false);
  }else {
    sessionStorage.setItem('haschallange',true);
    challenge = JSON.parse(challengeString);
    console.log(challenge);
  }
  return challenge;
}

document.getElementById("question-form").addEventListener("submit", function(event) {
    event.preventDefault();

  //Atualizar Quiz respondido na sessão
   let answered_challenges = getAnsweredChallenges();
   answered_challenges.push(challange.numb);
   sessionStorage.setItem('answered_challenges', JSON.stringify(answered_challenges));
   //limpar token da sessão e quiz atual 
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('challange');
    window.location.href = "../../play/menu.html";
  });