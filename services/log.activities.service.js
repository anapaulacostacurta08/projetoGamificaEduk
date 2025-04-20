const logActivityService = {
    save: (log_activities) => {
        return firebase.firestore()
            .collection("log_activities")
            .doc()
            .set(log_activities);
    },
    getAtivitityByUserUID: async (activity_id,user_UID) => {
        const querySnapshot = await firebase.firestore().collection("log_activities")
        .where("activity_id", "==", activity_id)
        .where('user_UID','==',user_UID)
        .orderBy("date", "asc")
        .orderBy("time", "asc")
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            return null;
        }
        const log_activity = querySnapshot.docs.map(doc=>doc.data());
        console.log(log_activity);
        return log_activity;
    },
    getAtivitityByChallenge: async (activity_id,user_UID, category) => {
        const querySnapshot = await firebase.firestore().collection("log_activities")
        .where("activity_id", "==", activity_id)
        .where('user_UID','==',user_UID)
        .where('category','==',category)
        .orderBy("date", "asc")
        .orderBy("time", "asc")
        .orderBy("pos_control_point","asc")
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            return null;
        }
        const log_activity = querySnapshot.docs.map(doc=>doc.data());
        console.log(log_activity);
        return log_activity;
    },
};