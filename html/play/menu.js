var activity_uid;
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    userService.findByUid(User.uid).then(user=>{
      const params = new URLSearchParams(window.location.search);
      activity_uid = params.get('activity_uid');
      activityService.getActivitybyUid(activity_uid).then((activity) => {
            var players = activity.players;
            var player = players.find(player => player.user_UID == User.uid);
            document.getElementById("score").innerHTML = player.score;
            document.getElementById("level").innerHTML = activity.level;
        });
    }).catch(error => {
        console.log(error);
    });
  } 
});

function btnQuiz() {
  window.location.href = "../question/token/token.html?category=quiz&activity_uid="+activity_uid;
}

function btnDesafio() {
  window.location.href = "../question/token/token.html?category=challange&activity_uid="+activity_uid;
}

function btnSorte() {
  window.location.href = "../question/token/token.html?category=luck&activity_uid="+activity_uid;
}

function btnExtra(){
  window.location.href = "../extra/extra.html?category=extra&activity_uid="+activity_uid;
}

function btnQuizfinal(){
  window.location.href = "../question/token/token.html?category=quizfinal&activity_uid="+activity_uid;
}