const boardgamesService = {
    findAll: async () => {
        const querySnapshot =  await firebase.firestore()
        .collection("boardgames")
        .get()
        console.log(querySnapshot);
        
        if(querySnapshot.empty){
            throw new Error("Retornou sem conteúdo");
        }

        var boardgames = new Array();
        querySnapshot.forEach(doc => {
            var id = doc.id;
            var dados = doc.data();
            var boardgame = {id,dados};
            boardgames.push(boardgame);
        });
        console.log(boardgames);
        return boardgames;
    },
    findByUid: async (uid) => {
        const querySnapshot =  await firebase.firestore()
            .collection("boardgames")
            .doc(uid)
            .get()
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Tabuleiro não encontrado:" + rodadaid);
            }
            var boardgames = new Array();
            querySnapshot.forEach(doc => {
                var id = doc.id;
                var dados = doc.data();
                var boardgame = {id,dados};
                boardgames.push(boardgame);
            });
            console.log(boardgames);
            return boardgames;
    },
    getBoardGameByRodadaID: async (rodadaid) => {
            const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('boardgameid','==',rodadaid)
            .where('state','==','started')
            .where('round_date','==',(new Date()).toLocaleDateString('pt-BR'))
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Não encontrado");
            }
            var boardgames = new Array();
            querySnapshot.forEach(doc => {
                var id = doc.id;
                var dados = doc.data();
                var boardgame = {id,dados};
                boardgames.push(boardgame);
            });
            console.log(boardgames);
            return boardgames;
    },
    getBoardGameByDados: async (boardgameid,round_date, host, level,state) => {
        const querySnapshot = await firebase.firestore().collection("boardgames")
        .where('boardgameid','==',boardgameid)
        .where('round_date','==',round_date)
        .where('host','==',host)
        .where('level','==',level)
        .where('state','==',state)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("Tabuleiro não encontrado:" + boardgameid);
        }
        var boardgames = new Array();
        querySnapshot.forEach(doc => {
            var id = doc.id;
            var dados = doc.data();
            var boardgame = {id,dados};
            boardgames.push(boardgame);
        });
        console.log(boardgames);
        return boardgames;
},
    getBoardgameRounds: async (boardgameid,round_date, host, level) => {
    const querySnapshot = await firebase.firestore().collection("boardgames")
    .where('boardgameid','==',boardgameid)
    .where('round_date','==',round_date)
    .where('host','==',host)
    .where('level','==',level)
    .get();
    console.log(querySnapshot);

    if(querySnapshot.empty){
        throw new Error("Tabuleiro não encontrado:" + boardgameid);
    }
    var boardgames = new Array();
    querySnapshot.forEach(doc => {
            var id = doc.id;
            var dados = doc.data();
            var boardgame = {id,dados};
            boardgames.push(boardgame);
    });
    console.log(boardgames);
    return boardgames;
},
getActivitiesbyDate: async (date) => {
    const querySnapshot = await firebase.firestore().collection("activities")
    .where('activity_date','==', date)
    .where('activity_state','==','started')
    .get();
    console.log(querySnapshot);

    if(querySnapshot.empty){
        throw new Error("Atividades não encontradas:" + date);
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
getActivities: async (activity_id) => {
    const querySnapshot = await firebase.firestore().collection("activities")
            .where('activity_id', '==',activity_id)
            .where('activity_state','==','started')
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Atividade não encontrado:" + activity_id);
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
getActivitybyPlayer: async (user_UID, date) => {
    const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('state','==','started')
            .where('activity_date_start','==',data)
            .where('activity_date_final','==',data)
            .where('activity_time_start','==',data)
            .where('activity_time_final','==',data)
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Tabuleiro não encontrado:" + rodadaid);
            }
            var boardgames = new Array();
            querySnapshot.forEach(doc => {
                var id = doc.id;
                var dados = doc.data();
                var players = dados.players;
                players.forEach(player => {
                    if(player.user_UID == user_UID){
                        var boardgame = {id,dados};
                        boardgames.push(boardgame);
                    }
                  });
                
            });
            console.log(boardgames);
            return boardgames;
},
    remove: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgames.uid)
            .delete();
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
        return await firebase.firestore()
            .collection("activities")
            .doc(id)
            .update(activities);
    }
};