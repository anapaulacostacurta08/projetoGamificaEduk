firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    let active_events_list = document.getElementById("active_events_list");
    let closed_events_list = document.getElementById("closed_events_list");
    enrollEventService.getEnrollsByUserUID(User.uid).then((enroll_events) => {
      if (!(enroll_events.length === 0)){
        enroll_events.forEach(enroll_event => {
          eventService.getEventByUID(enroll_event.dados.event_id).then(event =>{
            var event_id = enroll_event.dados.event_id;
            let card_event = `<span class="event_dados" id="${event_id}">${event.name} - ${enroll_event.dados.date} - ${enroll_event.dados.time}</span>`;
            card_coins = 
                  `<span id="coin" class="col-sm-3 ml-auto">`+
                    `<span class="badge rounded-pill bg-success">`+
                        `<span id="coins" class="badge bg-light text-dark">${enroll_event.dados.coins}</span>`+
                    `&nbsp;AB@ COINS`+
                    `</span>`+
                    `<br/>`+
                  `</span>`;
            let btn_enroll = `<button type="button" class="btn btn-primary rounded-pill" onclick="cardActiveSelected(${enroll_event.dados.event_id})">Entrar</span>`
            if (event.state === "started"){
              active_events_list.innerHTML =active_events_list.innerHTML +`<div class="card">${card_event}${card_coins}${btn_enroll}</div>`;
            }
            if (event.state === "finished"){
              closed_events_list.innerHTML = closed_events_list.innerHTML +`<div class="card">${card_event}${card_coins}${btn_enroll}</div>`;
            }
          });   
        })
      }
    });
  }
});

  //if user clicked on card
  function cardActiveSelected(eventuid) {
    let event_id = eventuid.id;
    window.location.href = `./activities-event-dashboard.html?event_id=${event_id}`;
  }

  //if user clicked on card
  function cardClosedSelected(eventuid) {
    let event_id = eventuid.id;
    window.location.href = `./activities-event-dashboard.html?event_id=${event_id}`;
  }