firebase.auth().onAuthStateChanged((User) => {
    if (User) {
    // Captura o evento de envio do formulário
    document.getElementById("extrato-form").addEventListener("submit", function(event) {
        event.preventDefault();
        // Captura os dados do formulário
        const select = document.getElementById("level");
        const level = select.options[select.selectedIndex].value;
        const extrato = document.querySelector(".card-extrato");
        let linhas = ''; 

        logactivitiesService.getLogboardgameByUserUID(User.uid,level).then(logactivities => {
            logactivities.forEach(log_activity => {
                let data_hora = '<td><span>'+ log_activity.data+'-</span>'+'<span>'+log_activity.hora+'</span></td>';
                let activity_id = '<td><span>'+log_activity.activity_id+'</span></td>';
                let question = '<td><span>'+log_activity.category+'-</span>'+'<span>'+log_activity.quiz_numb+'-</span>'+'<span>'+log_activity.user_answer+'</span></td>';
                let score_old = '<td><span>'+log_activity.score_old+'</span></td>';
                let score_new = '<td><span>'+log_activity.score_round+'</span></td>';
                let tokenid = '<td><span>'+log_activity.tokenid;+'</span></td>';
                linhas = linhas +'<tr>'+data_hora+activity_id+question+score_old+score_new+tokenid+'</tr>';
            });
            let tbody = '<tbody>'+linhas+'</tbody>';
            let thead = '<thead><tr><th>Data/Hota</th><th>Atividade</th><th>Questão</th><th>Score Anterior</th><th>Score Novo</th><th>Token</th></tr></thead>';     
            let table = '<table class="table table-bordered">'+ thead + tbody+'</table>';
            extrato.innerHTML = table;
        }).catch((error) => {
            let errorString = '<span>'+ error+'<span>';
            extrato.innerHTML = errorString;
        });
    });
}
})


