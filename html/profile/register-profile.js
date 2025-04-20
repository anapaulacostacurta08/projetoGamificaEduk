document.getElementById('profile').addEventListener('change', function () {
    var style = this.value == "player" ? 'block' : 'none';
    document.getElementById('list_hosts').style.display = style;

    const list_hosts = document.getElementById("list_hosts");
    userService.getHosts().then( (hosts) =>{
        
        let select = `<label class="form-label" for="hosts"><strong>Anfitrões:</strong><select id="hosts" name="hosts" class="form-control form-control-sm">`;
        hosts.forEach(host => {
            select = select +`<option value="${host.uid}" selected>"${host.name}"</option>`;
        });
        select = select + `</select>`; 
        list_hosts.innerHTML = select;
    });
});

firebase.auth().onAuthStateChanged((User) => {
    if (User) {
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
        userService.findByUid(User.uid).then(user =>{
            if(user === undefined){
              //Usuário não está cadastrado, tem que ser atualizado perfil
              document.getElementById("profile-form").addEventListener("submit", function(event) {
                    event.preventDefault();
                    // Captura os dados do formulário
                    var avatar = "avatar1";
                    var state = false; // insere desativado
                    let profile_options = document.getElementById("profile");
                    var profile = profile_options.options[profile_options.selectedIndex].value;
                    let hosts_options = document.getElementById("hosts");
                    var host = hosts_options.options[hosts_options.selectedIndex].value;
                    let name = document.getElementById("name").value;
                    let nickname = document.getElementById("nickname").value;
                    let uid = User.uid;
                    
                    const users = {
                        name, 
                        nickname, 
                        profile, 
                        host,
                        avatar,
                        state,
                        uid,
                    }
                    
                    let profile_register = uid;
                    let profile_name = name;
                    let date_register = (new Date()).toLocaleDateString('pt-BR');
                    let time_register = (new Date()).toLocaleTimeString('pt-BR');
                    let host_approver = host;
                    let profile_state = state;
                    let type = "register";

                    const log_profile = {type, profile_register, profile_name, date_register,time_register, host_approver, profile_state};
                    
                    userService.save({users});
                    logprofileService.save(log_profile);

                    msg_sucesso.innerHTML= "Cadastrado atualizado com sucesso! Aguarde seu perfil ser ativado pelo Anfitrião do Evento.";
                    alert_sucesso.classList.add("show");
                    document.getElementById("save").disabled = true;
                });
            }else{
                console.log('Usuário já cadastrado:'+User.uid+'-'+user.name);
                msg_error.innerHTML= 'Usuário já cadastrado:'+User.uid+'-'+user.name;
                alert_error.classList.add("show");
                document.getElementById("save").disabled = true;
            }
        })
    }
});






