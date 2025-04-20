popularSelectHosts();
popularSelectEvents();
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    document.getElementById("activity-form").addEventListener("submit", function(event) {
        event.preventDefault();
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
      
        // Captura os dados do formulário
        const date_start = new Date((document.getElementById("activity_date_start").value).replace("-","/")).toLocaleDateString('pt-BR');
        const date_final = new Date((document.getElementById("activity_date_final").value).replace("-","/")).toLocaleDateString('pt-BR');
        const time_start = document.getElementById("activity_time_start").value;
        const name = document.getElementById("activity_name").value;
        const time_final = document.getElementById("activity_time_final").value;
        const level = document.getElementById("activity_level").value;
        const hosts_options = document.getElementById("hosts");
        const host = hosts_options.options[hosts_options.selectedIndex].value;
        //const players = [];
        //const schedule = {};
        const id = document.getElementById("activity_id").value;
        const state = "waiting"; // "waiting", "started", "finished"
        const events_options = document.getElementById("events");
        const event_id  = events_options.options[events_options.selectedIndex].value;
      
        // Cria o objeto para salvar o quiz
        const newactivity = {
          date_start,
          date_final,
          time_start,
          time_final,
          //players,
          //schedule,
          id,
          name,
          level,
          host,
          state,
          event_id,  
        };
        try{
          activityService.save(newactivity);
          msg_sucesso.innerHTML= "Atividade cadastrada com Sucesso!";
          alert_sucesso.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        } catch (error){
          msg_error.innerHTML= error;
          alert_error.classList.add("show");
        }
    });
  }
})
function popularSelectHosts() {
  let Hosts = document.getElementById("hosts");
  userService.getHosts().then(hosts=>{
    hosts.forEach(host => {
      Hosts.innerHTML = Hosts.innerHTML +`<option value="${host.uid}">${host.name}</option>`;
    });
  });
}

function popularSelectEvents() {
  let Events = document.getElementById("events");
  eventService.getEvents().then( events => {
    events.forEach(event => {
      Events.innerHTML = Events.innerHTML +`<option value="${event.uid}">${event.dados.name}</option>`;
    });
  })
}