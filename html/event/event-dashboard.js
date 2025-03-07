firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    let active_events_list = document.getElementById("active_events_list");
    let closed_events_list = document.getElementById("closed_events_list");
    eventService.getEventsByUserUID(User.uid).then((events) => {
        let card_active_event = ``;
        let card_closed_event = ``;
        events.forEach(event => {
            let card_event = `<span class="event_dados" id="${event.uid}">${event.dados.name}</span>`;
            let players = event.dados.players;
            players.forEach(player => {
                if(player.user_UID === User.uid){
                  card_coins = 
                  `<span id="coin" class="col-sm-3 ml-auto">`+
                    `<span class="badge rounded-pill bg-success">`+
                        `<span id="coins" class="badge bg-light text-dark">${player.coins}</span>`+
                    `&nbsp;AB@ COINS`+
                    `</span>`+
                    `<br/>`+
                  `</span>`;
                }
            })
            if (event.dados.state === "started"){
              card_active_event = card_active_event +`<div class="card card_active">${card_event}${card_coins}</div>`;
            }
            if (event.dados.state === "finished"){
              card_closed_event = card_closed_event +`<div class="card card_closed">${card_event}${card_coins}</div>`;
            }
        })
        active_events_list.innerHTML = card_active_event;
        closed_events_list.innerHTML = card_closed_event;
        const card_active = active_events_list.querySelectorAll(".card_active");
        const card_closed = closed_events_list.querySelectorAll(".card_closed");
        // set onclick attribute to all available cards active
        for (i = 0; i < card_active.length; i++) {
          card_active[i].setAttribute("onclick", "cardActiveSelected(this)");
        }
         // set onclick attribute to all available cards closed
        for (i = 0; i < card_closed.length; i++) {
          card_closed[i].setAttribute("onclick", "cardClosedSelected(this)");
        }
    });   
  } 
});
  //if user clicked on card
  function cardActiveSelected(answer) {
    let event_uid= answer.querySelector(".event_dados").id;
    window.location.href = `./activities-event-dashboard.html?event_uid=${event_uid}&state=started`;
  }

  //if user clicked on card
  function cardClosedSelected(answer) {
    let event_uid= answer.querySelector(".event_dados").id;
    window.location.href = `./activities-event-dashboard.html?event_uid=${event_uid}&state=finished`;
  }