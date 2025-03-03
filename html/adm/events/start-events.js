firebase.auth().onAuthStateChanged((User) => {
  if (User) {
      const lista_events = document.getElementById("list_events");
      const pesquisa_events = document.getElementById("start-events-form");
      const ativar_event = document.getElementById("ativar-event-form");
      ativar_event.style.display = "none";

      // Captura o evento de envio do formulário
      document.getElementById("start-events-form").addEventListener("submit", function(event) {
        event.preventDefault();
        // Captura os dados do formulário
        const event_date = new Date((document.getElementById("event_date").value).replace('-','/')).toLocaleDateString('pt-BR');
        const event_id = document.getElementById("event_id").value;
        const event_state = "waiting"; // "waiting", "started", "finished"

        let linhas = ''; 
        eventService.getEventsbyDateStart(event_id, event_date, event_state).then(events => {
          events.forEach(event => {
                  var event_dados = event.dados;
                  let linha_id = `<td><span><label class="form-check-label" for="${event.uid}">${event_dados.id}</label></span></td>`;
                  let date = `<td><span>${event_dados.date_start}</span>-<span>${event_dados.time_start}</span>-<span>${event_dados.date_final}</span>-<span>${event_dados.time_final}</span></td>`; 
                  let radio = `<td><input type="radio" class="form-check-activate" id="${event.uid}" name="radio_id" value="${event.uid}" checked"></td>`;
                  linhas = linhas + '<tr>'+radio+linha_id+date+'</tr>';
              })
              let tbody = `<tbody>${linhas}</tbody>`;
              let thead = `<thead><tr><th></th><th>Evento</th><th>Inicio</th></tr></thead>`;     
              let table = `<table class="table table-hover" align="center">${thead}${tbody}</table>`;
              lista_events.innerHTML = table;
              pesquisa_events.style.display = "none";
              ativar_event.style.display = "inline";
          }).catch((error) => {
              let errorString = '<span>'+ error.message+'<span>';
              lista_events.innerHTML = errorString;
        });  
      });

      document.getElementById("ativar-event-form").addEventListener("submit", function(event) {
        event.preventDefault();
          // listar as actividades para vincular com evento
          var alert_sucesso = document.getElementById("alert_sucesso");
          var alert_error = document.getElementById("alert_error");
          var msg_sucesso = document.getElementById("res_sucesso");
          var msg_error = document.getElementById("res_error");  
          let userselect = document.querySelector('input[name="radio_id"]:checked').value;
          let events = {state: "started"};
          
          eventService.update(userselect, events).then(() => {
            msg_sucesso.innerHTML= "Evento iniciado com sucesso!";
            alert_sucesso.classList.add("show");
            document.getElementById("ativar").disabled = true;
          }).catch((error) => {
            msg_error.innerHTML= error;
            alert_error.classList.add("show");
          });
      });

    }
});
