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
getBoardgamebyData: async (data) => {
    const querySnapshot = await firebase.firestore().collection("boardgames")
    .where('round_date','==', data)
    .where('state','==','started')
    .get();
    console.log(querySnapshot);

    if(querySnapshot.empty){
        throw new Error("Tabuleiroe não encontrados:" + data);
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
getBoardgamebyPlayer: async (user_UID, data) => {
    const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('state','==','started')
            .where('round_date','==',data)
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
    save: async (boardgames) => {
        return await firebase.firestore()
            .collection("boardgames")
            .doc()
            .set(boardgames)
    },
    update: async (id,boardgame)  => {
        return await firebase.firestore()
            .collection("boardgames")
            .doc(id)
            .update(boardgame);
    },
    addPlayers:  async (id, players) => {
        try{
        const querySnapshot = await firebase.firestore()
            .collection("boardgames")
            .doc(id)
            .update(players);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};