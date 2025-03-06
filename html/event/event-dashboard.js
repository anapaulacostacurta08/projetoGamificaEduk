firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    let events_list = document.getElementById("events_list");
    eventService.getEventsByUserUID(User.uid).then((events) => {
        let card_event = ``;
        events.forEach(event => {
            card_event = `<div class="card"><span class="event_dados" value="${event.uid}>${event.dados.name} - ${event.dados.state}</span>`;
            let players = event.dados.players;
            players.forEach(player => {
                if(player.user_UID === User.uid){
                  card_event =   card_event + 
                    `<span id="coin" class="col-sm-3 ml-auto"><span class="badge rounded-pill bg-success"><span id="coins" class="badge bg-light text-dark">${player.coins}</span>&nbsp;AB@ COINS</span><br/></span>`;
                }
            })
            card_event =   card_event + `</div>`;
        })
        events_list.innerHTML = card_event;

        const card = events_list.querySelectorAll(".card");
        // set onclick attribute to all available options
        for (i = 0; i < option.length; i++) {
          card[i].setAttribute("onclick", "cardSelected(this)");
        }

        //if user clicked on card
        function cardSelected(answer) {
          let event_uid= answer.querySelector(".event_dados").value;
          window.location.href = "./activities-event-dashboard.html?event_uid="+event_uid;
        }
    });   
  } 
});
  //if user clicked on card
  function cardSelected(answer) {
    let event_uid= answer.querySelector(".event_dados").value;
    window.location.href = "./activities-event-dashboard.html?event_uid="+event_uid;
  }