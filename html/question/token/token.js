var activity_uid;
var tokenid;
firebase.auth().onAuthStateChanged( (User) => {
    var player;
    var tmp_players;
    var atual_tokens_quiz_used;
    var tokens_quiz;
    if (!User) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }else{
          const params = new URLSearchParams(window.location.search);
          const category = params.get('category');
          activity_uid = params.get('activity_uid');
          activityService.getActivitybyUid(activity_uid).then((activityfind) => {
            var activity = activityfind;
            tmp_players = activityfind.players;
            player = tmp_players.find(player => player.user_UID == User.uid);
            atual_tokens_quiz_used = player.tokens_quiz_used;
          });

          tokenService.getTokens().then(tokens => {
                tokens.forEach(token => {
                    tokens_quiz = token.quiz;
                });
            });

          document.getElementById("play-form").addEventListener("submit", function(event) {
            event.preventDefault();
            // Captura os dados do formulário
            tokenid = document.getElementById("tokenid").value;
                if(category == "quiz"){
                    let pos_token = tokens_quiz.indexOf(tokenid);
                    let pos_token_used = atual_tokens_quiz_used.indexOf(tokenid);  
                    if (!(pos_token_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                        if(pos_token > -1){ 
                            var players = new Array();
                            var last = tmp_players.length;
                            for(i=0;i<last;i++){
                                let quiz_answered = new Array();
                                let atual_quiz_answered = tmp_players[i].quiz_answered;
                                let last_quiz_answered = atual_quiz_answered.length;
                                for (j=0; j<last_quiz_answered;j++){
                                    quiz_answered[j] = atual_quiz_answered[j];
                                }
                                let tokens_quiz_used = new Array();
                                let last_token_quiz = tmp_players[i].tokens_quiz_used.length;
                                let atual_tokens_quiz_used = tmp_players[i].tokens_quiz_used;
                                for (j=0; j<last_token_quiz;j++){
                                    tokens_quiz_used[j] = atual_tokens_quiz_used[j];
                                }
                                let user_UID = tmp_players[i].user_UID; 
                                let score = tmp_players[i].score;
                                let ckeckin_date = tmp_players[i].ckeckin_date;
                                let ckeckin_time =  tmp_players[i].ckeckin_time;
                                let timestamp = tmp_players[i].timestamp;
                                if(tmp_players[i].user_UID == User.uid){
                                    timestamp = new Date().getTime();
                                    tokens_quiz_used[last_token_quiz] = tokenid;
                                }
                                players[i] = {user_UID,score,ckeckin_date,ckeckin_time, timestamp, tokens_quiz_used, quiz_answered};
                            }                              
                            try{
                                activityService.update(activity_uid, {players}).then(alert("Token Válido!"));
                                window.location.href = "../quiz/quiz.html?activity_uid="+activity_uid+"&tokenid="+tokenid;
                            } catch (error) {
                                alert(error);
                                window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
                            }
                        }else{
                            alert("Token inválido!");
                            window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
                        }
                    }else{
                        alert("Token inválido!");
                        window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
                    }
                }
                if(category == "challange"){
                    window.location.href = "../challange/challange.html";
                }
                if(category == "luck"){
                    window.location.href = "../luck/luck.html";
                }
                if(category == "quiz_final"){
                    window.location.href = "../final/final.html";
                }
        });
    } 
});

