const checkinactivityService = {
    getcheckinbyPlayer: async (activity_uid, user_UID) => {
        const querySnapshot = await firebase.firestore().collection("checkin_activities")
                .where("activity_id", "==", activity_uid)
                .where("user_UID", "==", user_UID)
                .orderBy("date", "asc")
                .orderBy("time", "asc")
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
                .collection("checkin_activities")
                .doc()
                .set(activities);
                return querySnapshot;
            }catch (error) {
                throw error;
            }
        },
        update: async (id,checkin_activity)  => {
            try{
                const querySnapshot = await firebase.firestore().collection("checkin_activities")
                .doc(id)
                .update(checkin_activity);
                return querySnapshot;
            }catch (error) {
                throw error;
            }
        }
    };