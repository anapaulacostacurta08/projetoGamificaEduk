firebase.auth().onAuthStateChanged((User) => {
    if (!User) {
        window.location.href = "../login/login.html";
    }else{
        var name;
        var admin;
        var nickname;
        var profile;
        var avatar
        var status;
        userService.findByUid(User.uid).then(user=>{
            name = user.name;
            nickname = user.nickname;
            avatar = user.avatar;
            profile = user.profile;
            admin = user.admin;
            status = user.status;
            document.getElementById("avatar").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
        }).catch(error => {
            console.log(error.message);
            status = false;
        });
        
    }
});

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function voltar(){
    window.location.href = "home.html";
}

function buscarAvatar(){
    const lista_avatars = document.getElementById("lista_avatars");
    let linha_id = '<td><span>'+'<label class="form-check-label" for="'+1+'">'+'<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar1+'.png" width="50" height="50"></img>'+'</span></label></td>';
    let radio = '<td><input type="radio" class="form-check-activate" id="avatar_id" name="avatar_id" value="'+avatar1+'" checked"></td>';
    linhas = linhas + '<tr>'+radio+linha_id+'</tr>';  
    linha_id = '<td><span>'+'<label class="form-check-label" for="'+2+'">'+'<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar2+'.png" width="50" height="50"></img>'+'</span></label></td>';
    radio = '<td><input type="radio" class="form-check-activate" id="avatar_id" name="avatar_id" value="'+avatar2+'" checked"></td>';
    linhas = linhas + '<tr>'+radio+linha_id+'</tr>';  
    let tbody = '<tbody>'+linhas+'</tbody>';
    let thead = '<thead><tr><th></th><th>Atividade</th><th>Level</th><th>Inicio</th><th>Fim</th><th>Status</th></tr></thead>';     
    let table = '<table class="table table-hover" align="center">'+ thead + tbody+'</table>';
    lista_avatars.innerHTML = table;
}



