const activityService = {
    getActivitiesbyDateStart: async (activity_id, activity_date, activity_host, activity_level, activity_state) => {
        const querySnapshot = await firebase.firestore().collection("activities")
        .where('id','==',activity_id)
        .where('date_start','==',activity_date)
        .where('host','==',activity_host)
        .where('level','==',activity_level)
        .where('state','==',activity_state)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("01 - Não encontrado.");
        }
        var activities = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var activity = {uid,dados};
            activities.push(activity);
        });
        console.log(activities);
        return activities;
},
    getActivities: async (id) => {
    const querySnapshot = await firebase.firestore().collection("activities")
            .where('id', '==',id)
            .where('state','==','started')
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("01 - Não encontrado.");
            }
            var activities = new Array();
            querySnapshot.forEach(doc => {
                var uid = doc.id;
                var dados = doc.data();
                var activity = {uid,dados};
                activities.push(activity);
            });
            console.log(activities);
            return activities;
},
    getActivitybyUid: async (uid) => {
        return await firebase.firestore().collection("activities")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    getActivitybyPlayer: async (user_UID) => {
    const querySnapshot = await firebase.firestore().collection("activities")
            .orderBy("date_start", "asc")
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("01 - Não encontrado.");
            }
            var activities = new Array();
            querySnapshot.forEach(doc => {
                var uid = doc.id;
                var dados = doc.data();
                var players = dados.players;
                players.forEach(player => {
                    if(player.user_UID == user_UID){
                        var activity = {uid,dados};
                        activities.push(activity);
                    }
                  });
                
            });
            console.log(activities);
            return activities;
    },
    getActivitiesActives: async () => {
        const querySnapshot = await firebase.firestore().collection("activities")
                .orderBy("date_start", "asc")
                .get();
                console.log(querySnapshot);
    
                if(querySnapshot.empty){
                    throw new Error("01 - Não encontrado.");
                }
                var activities = new Array();
                querySnapshot.forEach(doc => {
                    var uid = doc.id;
                    var dados = doc.data();
                    var activity = {uid,dados};
                    if( !(activity.dados.state === "finished")){
                        activities.push(activity);
                    }                
                });
                console.log(activities);
                return activities;
    },
    getActivitybyPlayer: async (user_UID) => {
        const querySnapshot = await firebase.firestore().collection("activities")
                .orderBy("date_start", "asc")
                .get();
                console.log(querySnapshot);
    
                if(querySnapshot.empty){
                    throw new Error("01 - Não encontrado.");
                }
                var activities = new Array();
                querySnapshot.forEach(doc => {
                    var uid = doc.id;
                    var dados = doc.data();
                    var players = dados.players;
                    players.forEach(player => {
                        if(player.user_UID == user_UID){
                            var activity = {uid,dados};
                            activities.push(activity);
                        }
                      });
                    
                });
                console.log(activities);
                return activities;
    },
    getActivitiesbyEventUID: async (event_uid) => {
        const querySnapshot = await firebase.firestore().collection("activities")
                .where("event_id","==",event_uid)
                .orderBy("date_start", "asc")
                .get();
                console.log(querySnapshot);
    
                if(querySnapshot.empty){
                    return [];
                }
                var activities = new Array();
                querySnapshot.forEach(doc => {
                    var uid = doc.id;
                    var dados = doc.data();
                    var activity = {uid,dados};
                    activities.push(activity);
                });
                console.log(activities);
                return activities;
    },
    save: async (activities) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("activities")
            .doc()
            .set(activities);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (id,activities)  => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("activities")
            .doc(id)
            .update(activities);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};