const enrollEventService = {
    getEnrollsByEventUidUserUid: async (event_uid, user_UID) => {
        const querySnapshot = await firebase.firestore().collection("enroll_events")
        .where("event_id", "==", event_uid)
        .where("user_UID","==", user_UID)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
           return [];
        }

        var enroll_events = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var enroll_event = {uid,dados};
            enroll_events.push(enroll_event);
        });
        
        console.log(enroll_events);
        return enroll_events;
    },
    getEnrollsByUserUID: async (user_UID) => {
        const querySnapshot = await firebase.firestore().collection("enroll_events")
        .where("user_UID","==", user_UID)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
           return [];
        }

        var enroll_events = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var enroll_event = {uid,dados};
            enroll_events.push(enroll_event);
        });
        console.log(enroll_events);
        return enroll_events;
    },
    save: async (enroll_events) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("enroll_events")
            .doc()
            .set(enroll_events);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (uid,enroll_events)  => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("enroll_events")
            .doc(uid)
            .update(enroll_events);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};