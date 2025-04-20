const activityTaskService = {
    getTaskActivity: async (activity_id) => {
        const querySnapshot = await firebase.firestore().collection("activity_tasks")
                .where('activity_id','==',activity_id)
                .get();
                console.log(querySnapshot);
    
                if(querySnapshot.empty){
                    return [];
                }
                var activity_tasks = new Array();
                querySnapshot.forEach(doc => {
                    var uid = doc.id;
                    var dados = doc.data();
                    var activity_task = {uid,dados};
                    activity_tasks.push(activity_task);
                });
                console.log(activity_tasks);
                return activity_tasks;
    },
    save: async (activity_task) => {
        try{
            const querySnapshot = await firebase.firestore().collection("activity_tasks")
            .doc()
            .set(activity_task);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (id,activity_task)  => {
        try{
            const querySnapshot = await firebase.firestore().collection("activity_tasks")
            .doc(id)
            .update(activity_task);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
};