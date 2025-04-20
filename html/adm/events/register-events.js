const list_hosts = document.getElementById("list_hosts");
  userService.getHosts().then(hosts=>{
      let select = `<label class="form-label" for="hosts"><strong>Anfitriões:</strong><select id="hosts" name="hosts" class="form-control form-control-sm">`;
      hosts.forEach(host => {
          select = select +`<option value="${host.uid}" selected>"${host.name}"</option>`;
      });
      select = select + `</select>`; 
      list_hosts.innerHTML = select;
});


firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    document.getElementById("event-form").addEventListener("submit", function(event) {
        event.preventDefault();
       
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
      
        // Captura os dados do formulário
        const date_start = new Date((document.getElementById("event_date_start").value).replace("-","/")).toLocaleDateString('pt-BR');
        const date_final = new Date((document.getElementById("event_date_final").value).replace("-","/")).toLocaleDateString('pt-BR');
        const time_start = document.getElementById("event_time_start").value;
        const name = document.getElementById("event_name").value;
        const time_final = document.getElementById("event_time_final").value;
        const id = document.getElementById("event_id").value;
        const state = "waiting"; // "waiting", "started", "finished"
        const hosts_options = document.getElementById("hosts");
        const host = hosts_options.options[hosts_options.selectedIndex].value;
      
        // Cria o objeto para salvar o quiz
        const newevent = {
          date_start,
          date_final,
          time_start,
          time_final,
          host,
          id,
          name,
          state,  
        };
        try{
          eventService.save(newevent);
          msg_sucesso.innerHTML= "Evento cadastrada com Sucesso!";
          alert_sucesso.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        } catch (error){
          msg_error.innerHTML= error;
          alert_error.classList.add("show");
        }
    });
  }
})
