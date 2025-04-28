const activityContentsService = {
    getContentsActivity: async (activity_id) => {
        const querySnapshot = await firebase.firestore().collection("activity_contents")
                .where('activity_id','==',activity_id)
                .get();
                console.log(querySnapshot);
    
                if(querySnapshot.empty){
                    return null;
                }
                var activity_contents = new Array();
                querySnapshot.forEach(doc => {
                    var uid = doc.id;
                    var dados = doc.data();
                    var activity_content = {uid,dados};
                    activity_contents.push(activity_content);
                });
                console.log(activity_contents);
                return activity_contents;
    },
    save: async (activity_content) => {
        try{
            const querySnapshot = await firebase.firestore().collection("activity_contents")
            .doc()
            .set(activity_content);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (id,activity_content)  => {
        try{
            const querySnapshot = await firebase.firestore().collection("activity_contents")
            .doc(id)
            .update(activity_content);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
};