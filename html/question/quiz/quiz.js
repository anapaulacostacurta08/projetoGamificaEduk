//Buscar quiz e colocar na sessão;
var user_UID = sessionStorage.userUid;

let hasquiz;
if (sessionStorage.hasquiz === undefined || sessionStorage.hasquiz === "undefined") {
  sessionStorage.setItem("hasquiz",true);
}else{
  if(sessionStorage.hasquiz == "true"){
    hasquiz = true;
  }else{
    hasquiz = false;
  }
}
if(hasquiz){
    showQuestion(quiz);
    startTimer(15);
}

function fechar(){
    sessionStorage.removeItem('token_quiz');
    sessionStorage.removeItem('quiz');
    window.location.href = "../../play/menu.html";
}


  