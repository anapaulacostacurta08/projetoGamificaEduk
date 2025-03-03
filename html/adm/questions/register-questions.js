popularSelectActivities();
firebase.auth().onAuthStateChanged( (User) => {
  if (User){
    var alert_sucesso = document.getElementById("alert_sucesso");
    var alert_error = document.getElementById("alert_error");
    var msg_sucesso = document.getElementById("res_sucesso");
    var msg_error = document.getElementById("res_error");

    // Captura o evento de envio do formulário
    document.getElementById("register-form").addEventListener("submit", function(event) {
      event.preventDefault();

      // Captura os dados do formulário
      const category = document.getElementById("category").value;
      //const type = document.getElementById("type").value;
      const type = "multiple";
      const level = document.getElementById("level").value;
      const text = document.getElementById("text").value;
      //const options = document.getElementById("options").value.split(",").map(option => option.trim()); // Divide as opções
      var options = new Array();
      for (i=1;i<=5;i++){
         let option = document.getElementById(`option${i}`).value;
         if ( !(option.trim() === "")){
          options[i-1] = option;
         }
      }

      const answer = document.getElementById("answer").value.split(",").map(answer => answer.trim());
      const activities_options = document.getElementById("activities");
      const activity_id  = activities_options.options[activities_options.selectedIndex].value;


      // Cria o objeto para salvar o quiz
      const newQuiz = {
        category,
        type,
        level,
        text,
        options,
        answer,
        activity_id,
      };
      
      try{
        // Chama a função para salvar o quiz no Firestore
        questionsService.save(newQuiz);
        msg_sucesso.innerHTML= "Questão cadastrada com Sucesso!";
        alert_sucesso.classList.add("show");
        document.getElementById("bt-success").disabled = true;
        // Limpa o formulário após o envio
        document.getElementById("register-form").reset();
      } catch (error){
        msg_error.innerHTML= error;
        alert_error.classList.add("show");
      }
    });
  }
})

function popularSelectActivities() {
  firebase.auth().onAuthStateChanged( (User) => {
    if (User){
      let Activities = document.getElementById("activities");
      activityService.getActivitiesActives().then( activities => {
        activities.forEach(activity => {
          Activities.innerHTML = Activities.innerHTML + `<option value="${activity.uid}">${activity.dados.name}</option>`;
        });
      })
    }
  })
}