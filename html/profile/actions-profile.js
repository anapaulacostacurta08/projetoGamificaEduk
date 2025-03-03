var players;
var alert_sucesso = document.getElementById("alert_sucesso");
var alert_error = document.getElementById("alert_error");
var msg_sucesso = document.getElementById("res_sucesso");
var msg_error = document.getElementById("res_error");  

firebase.auth().onAuthStateChanged((User) => {
    if (User){
        const list_players = document.getElementById("list_players");
        userService.getPlayersInative(User.uid).then(players_find =>{
            let linhas=``;
            players = players_find;
            players.forEach(player => {
                let player_uid = `<td><span><label class="form-check-label" name="player" value="${player.uid}">${player.name}-${player.uid}</label></span></td>`;
                let state = `<td><span>${(player.state ? "Ativo" : "Desativado")}</span></td>`;
                let radio = `<td><input type="radio" class="form-check-activate player" id="${player.uid}" name="player_uid" value="${player.uid}"></td>`;
                linhas = linhas + `<tr>${radio}${player_uid}${state}</tr>`;
             })
            let tbody = `<tbody>${linhas}</tbody>`;
            let thead = `<thead><tr><th></th><th>Jogador</th><th>Status</th></tr></thead>`;     
            let table = `<table class="table table-hover" align="center">${thead}${tbody}</table>`;
            list_players.innerHTML = table;

        }).catch(error => {
            if(error.message === "01 - Não encontrado."){
                msg_error.innerHTML= 'Nenhum jogador encontrado para seu perfil.';
                alert_error.classList.add("show");
            }
            console.log(error);
        });

        
    }
});

function ativar() {
    firebase.auth().onAuthStateChanged((User) => {
        if (User){
            let userselect = document.querySelector('input[name="player_uid"]:checked').value;
            players.forEach(player =>{
                if(player.uid == userselect){
                    if(player.state){
                        msg_error.innerHTML= "Perfil já está ativo!";
                        alert_error.classList.add("show");
                    }else{
                        // Captura os dados do formulário
                        var player_uid = player.uid;
                        var users = {state: true};
                        var profile_approver = User.uid;
                        var date_approval = (new Date()).toLocaleDateString('pt-BR');
                        var time_approval = (new Date()).toLocaleTimeString('pt-BR');
                        var profile_activated = player_uid;
                        let type = "activate";
                        const log_profile = {type, profile_approver, date_approval, time_approval, profile_activated};

                        //Realiza a ativação do usuário
                        userService.update(player_uid,users);

                        //Grava logo da aprocação e ativação do usuário
                        logprofileService.save(log_profile);

                        msg_sucesso.innerHTML= "Perfil ativado com sucesso!";
                        alert_sucesso.classList.add("show");
                        document.getElementById("ativate").disabled = true;
                        document.getElementById("disable").disabled = true;
                    }
                }
            })
        }
    })
};

function refresh(){
    location.reload();
}

function desativar() { 
    firebase.auth().onAuthStateChanged((User) => {
        if (User){
            let userselect = document.querySelector('input[name="player_uid"]:checked').value;
            players.forEach(player =>{
                if(player.uid == userselect){
                    if(player.state){
                        // Captura os dados do formulário
                        var player_uid = player.uid; 
                        var users = {state: false};
                        var profile_disabler = User.uid;
                        var date_disable = (new Date()).toLocaleDateString('pt-BR');
                        var time_disable = (new Date()).toLocaleTimeString('pt-BR');
                        var profile_disactivated = player_uid;
                        let type = "disactivate";
                        const log_profile = {type, profile_disabler, date_disable, time_disable, profile_disactivated};
                        
                        //Realiza a ativação do usuário
                        userService.update(player_uid,users);
                    
                        //Grava logo da aprocação e ativação do usuário
                        logprofileService.save(log_profile);
                    
                        msg_sucesso.innerHTML= "Perfil desativado com sucesso!";
                        alert_sucesso.classList.add("show");
                        document.getElementById("ativate").disabled = true;
                        document.getElementById("disable").disabled = true;
                    }else{
                        msg_error.innerHTML= "Perfil já está desativado!";
                        alert_error.classList.add("show");
                        
                    }
                }
            });
        }
    })
}



