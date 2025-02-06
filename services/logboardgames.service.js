const logboardgamesService = {
    save: (log_answers) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc()
            .set(log_answers);
    },
    getLogboardgameByUserUID: async (user_UID,level) => {
        const querySnapshot = await firebase.firestore().collection("logboardgames")
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