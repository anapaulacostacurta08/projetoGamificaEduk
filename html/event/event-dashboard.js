firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    let events_list = document.getElementById("events_list").value;
    eventService.getEventsByUserUID(User.uid).then((events) => {
        events.forEach(event => {
            let event
            const listItem = document.createElement('li')
            listItem.innerHTML = `<div class="card"><span>${event.dados.name} - ${event.dados.state}</span>`;
            let players = event.dados.players;
            players.forEach(player => {
                if(player.user_UID === User.uid){
                    listItem.innerHTML =  listItem.innerHTML + 
                    `<span id="coin" class="col-sm-3 ml-auto"><span class="badge rounded-pill bg-success"><span id="coins" class="badge bg-light text-dark">${player.coins}</span>&nbsp;AB@ COINS</span><br/></span>`;
                }
            })
            listItem.innerHTML =  listItem.innerHTML + `</div>`;
            events_list.appendChild(listItem);
        })
    })
  } 
});