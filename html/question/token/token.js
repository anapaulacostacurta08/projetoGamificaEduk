var activity_uid;
var tokenid;
firebase.auth().onAuthStateChanged( (User) => {
    var player;
    var tmp_players;
    var tokens_quiz;
    var tokens_luck;
    var tokens_bonus;
    var tokens_challange;
    var tokens_quiz_final;
    if (!User) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }else{
          const params = new URLSearchParams(window.location.search);
          const category = params.get('category');
          activity_uid = params.get('activity_uid');
          activityService.getActivitybyUid(activity_uid).then((activityfind) => {
            tmp_players = activityfind.players;
            tmp_players.forEach(playerfind => {
                if(playerfind.user_UID == User.uid){
                    player = playerfind;      
                }
            })
            tokenService.getTokens().then(tokens => {
                tokens.forEach(token => {
                    tokens_quiz = token.quiz;
                    tokens_luck = token.luck;
                    tokens_bonus = token.bonus;
                    tokens_challange = token.challange;
                    tokens_quiz_final = token.quiz_final;
                });
            });
          });
          
          document.getElementById("play-form").addEventListener("submit", function(event) {
            event.preventDefault();  
            tokenid = document.getElementById("tokenid").value;
            if(category == "quiz"){
                var atual_tokens_quiz_used;
                atual_tokens_quiz_used = player.user_answered.quiz.tokens_used;
                let pos_token = tokens_quiz.indexOf(tokenid);
                let pos_token_used = atual_tokens_quiz_used.indexOf(tokenid);  
                if (!(pos_token_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                    if(pos_token > -1){ //Se encontrado foi é porque existe o token valor > -1 
                        window.location.href = "../quiz/quiz.html?activity_uid="+activity_uid+"&tokenid="+tokenid;
                    }
                }
                alert("Token inválido!");
                window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
            }
            if(category == "challange"){
                var atual_tokens_challange_used;
                atual_tokens_challange_used = player.user_answered.challange.tokens_used;
                let pos_token = tokens_challange.indexOf(tokenid);
                let pos_token_used = atual_tokens_challange_used.indexOf(tokenid);  
                if (!(pos_token_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                    if(pos_token > -1){ //Se encontrado foi é porque existe o token valor > -1 
                        window.location.href = "../challange/challange.html?activity_uid="+activity_uid+"&tokenid="+tokenid;
                    }
                }
                alert("Token inválido!");
                window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
            }
            if(category == "bonus"){
                var atual_tokens_bonus_used;
                atual_tokens_bonus_used = player.user_answered.bonus.tokens_used;
                let pos_token = tokens_bonus.indexOf(tokenid);
                let pos_token_used = atual_tokens_bonus_used.indexOf(tokenid);  
                if (!(pos_token_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                    if(pos_token > -1){ //Se encontrado foi é porque existe o token valor > -1 
                        window.location.href = "../bonus/bonus.html?activity_uid="+activity_uid+"&tokenid="+tokenid;
                    }
                }
                alert("Token inválido!");
                window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
            }
            if(category == "luck"){
                var atual_tokens_luck_used;
                var atual_tokens_setback_used;
                atual_tokens_luck_used = player.user_answered.luck.tokens_used;
                atual_tokens_setback_used = player.user_answered.setback.tokens_used;
                let pos_token = tokens_luck.indexOf(tokenid);
                let pos_token_luck_used = atual_tokens_luck_used.indexOf(tokenid); 
                let pos_token_setback_used = atual_tokens_setback_used.indexOf(tokenid);
                if (!(pos_token_luck_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                    if (!(pos_token_setback_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                        if(pos_token > -1){ // Se encontrado foi é porque existe o token valor > -1 
                            window.location.href = "../luck/spin_luck.html?activity_uid="+activity_uid+"&tokenid="+tokenid;
                        }
                    }
                }
                alert("Token inválido!");
                window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
            }
            if(category == "quiz_final"){
                var atual_tokens_quiz_final_used;
                atual_tokens_quiz_final_used = player.user_answered.quiz_final.tokens_used;
                let pos_token = tokens_quiz_final.indexOf(tokenid);
                let pos_token_quiz_final_used = atual_tokens_quiz_final_used.indexOf(tokenid); 
                if (!(pos_token_quiz_final_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                    if(pos_token > -1){ // Se encontrado foi é porque existe o token valor > -1 
                        window.location.href = "../final/final.html?activity_uid="+activity_uid+"&tokenid="+tokenid;
                    }
                }
                alert("Token inválido!");
                window.location.href = "../../play/menu.html?activity_uid="+activity_uid;
            }
        });
    }
});

