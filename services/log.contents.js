const logContentsService = {
    save: (log_contents) => {
        return firebase.firestore()
            .collection("log_contents")
            .doc()
            .set(log_contents);
    },
    getContentsByActivityandUser: async (activity_id,user_UID) => {
        const querySnapshot = await firebase.firestore().collection("log_contents")
        .where("activity_id", "==", activity_id)
        .where('user_UID','==',user_UID)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            return null;
        }
        const log_contents = querySnapshot.docs.map(doc=>doc.data());
        console.log(log_contents);
        return log_contents;
    },
};