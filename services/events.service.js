const eventService = {
    getEventsbyDateStart: async (event_id, event_date, event_state) => {
        const querySnapshot = await firebase.firestore().collection("events")
        .where('id','==',event_id)
        .where('date_start','==',event_date)
        .where('state','==',event_state)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("01 - Não encontrado.");
        }
        var events = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var event = {uid,dados};
            events.push(event);
        });
        console.log(events);
        return events;
    },
    getEventsByID: async (event_id) => {
        const querySnapshot = await firebase.firestore().collection("events")
        .where('id','==',event_id)
        .where('state','==','started')
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("01 - Não encontrado.");
        }
        var events = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var event = {uid,dados};
            events.push(event);
        });
        console.log(events);
        return events;
    },
    getEvents: async () => {
        const querySnapshot = await firebase.firestore().collection("events")
        .orderBy("date_start", "asc")
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("01 - Não encontrado.");
        }
        var events = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var event = {uid,dados};
            if( !(event.state === "finished")){
                events.push(event);
            }
        });
        console.log(events);
        return events;
    },
    save: async (events) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("events")
            .doc()
            .set(events);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (id,events)  => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("events")
            .doc(id)
            .update(events);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};