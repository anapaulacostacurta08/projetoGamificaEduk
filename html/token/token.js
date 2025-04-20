var activity_uid;
var token_id;
var tokens;
var tokens_used = new Array();

firebase.auth().onAuthStateChanged( (User) => {
    if (User) {
          const params = new URLSearchParams(window.location.search);
          const category = params.get('category');
          activity_uid = params.get('activity_uid');

          tokenService.getTokenByActivityUid(activity_uid).then(tokens_array =>{
            tokens_array.forEach(token_array =>{          
                tokens = token_array.players;  
            })
          });
          logActivityService.getAtivitityByUserUID(activity_uid,User.uid).then(log_activities =>{
            log_activities.forEach(log_activity => {
                let tokenid = log_activity.tokenid;
                tokens_used.push(tokenid);
            });
          });
          
          document.getElementById("play-form").addEventListener("submit", function(event) {
            event.preventDefault();  
            token_id = document.getElementById("tokenid").value;

            let pos_token = tokens.indexOf(token_id); 
            let pos_token_used = tokens_used.indexOf(token_id);  
            
            if (!(pos_token_used > -1)){ // Se encontrado foi usado. retorna -1 Não encontrado.
                if(pos_token > -1){ //Se encontrado foi é porque existe o token valor > -1 
                    window.location.href = `../${category}/${category}.html?activity_uid="+activity_uid+"&tokenid="+tokenid`;
                }
            }else{
                alert("Token inválido!");
                voltar();
            }
        })
            
    }
});

function voltar(){
    window.location.href = "../play/menu.html?activity_uid="+activity_uid;
}