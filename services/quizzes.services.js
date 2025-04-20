const quizService = {
    getQuizzesByUid: async (id) => {
        return await firebase.firestore().collection("quizzes")
            .doc(id)
            .get()
            .then(doc => {
                return doc.data();
            });
    }
}