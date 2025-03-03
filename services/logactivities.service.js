const logprofileService = {
    save: (log_profile) => {
        return firebase.firestore()
            .collection("log_profiles")
            .doc()
            .set(log_profile);
    },
    getLogboardgameByUserUID: async (user_UID,level) => {
        const querySnapshot = await firebase.firestore().collection("log_activities")
        .where('user_UID','==',user_UID)
        .where('level','==',level)
        .orderby('data')
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("Log não encontrada para o usuário:" + user_UID+ ","+ level + ".");
        }
        const logboardgames = querySnapshot.docs.map(doc=>doc.data());
        console.log(logboardgames);
        return logboardgames;
},
};