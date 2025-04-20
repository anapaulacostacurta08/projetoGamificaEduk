const logprofileService = {
    save: (log_answers) => {
        return firebase.firestore()
            .collection("log_profiles")
            .doc()
            .set(log_answers);
    }
};