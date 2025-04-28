
const title_text = document.getElementById("title_text");
const didyouknow_text = document.getElementById("didyouknow_text");
const example_text = document.getElementById("example_text");
const curiosity_text = document.getElementById("curiosity_text");
const tip_text = document.getElementById("tip_text");

var activity_id;
firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var user_UID = User.uid; 
    const params = new URLSearchParams(window.location.search);
    activity_id = params.get('activity_id'); 
    carregarAtividade(activity_id, user_UID);

    

    document.getElementById("content-form").addEventListener("submit", function(event) {
      event.preventDefault();  
      carregarAtividade(activity_id, user_UID);
    })

    function carregarAtividade(activity_id, user_UID){
      let level, points;
      activityService.getActivitybyUid(activity_id).then(activity =>{
        checkinactivityService.getcheckinbyPlayer(activity_id,user_UID).then(checkin_ativities =>{
          if(validarValor(activity)){
            level = activity.level;
          } 
          if(validarValor(checkin_ativities)){
            points = checkin_ativities[0].dados.points;
          }
          activityContentsService.getContentsActivity(activity_id).then(activitycontents =>{
            if(validarValor(activitycontents)){
              logContentsService.getContentsByActivityandUser(activity_id,user_UID).then(logContents => {
                if(validarValor(logContents)){
                  var contents_viewed = new Array();
                  logContents.forEach(logContent => {
                    var content_id = logContent.content_id;
                    contents_viewed.push(content_id);
                  })
                  activitycontents.forEach(activitycontent =>{
                    var content = activitycontent.dados.contents;
                    var contents_show = new Array();
                    bloco_showContent:{
                      for (i=0;i<content.length;i++){
                        var pos_content = contents_viewed.indexOf(content[i]);
                        if( pos_content == -1){ // -1 não encontrado, ou seja não foi visualizado
                          content = {content_id: content[i], viewed: true};
                          contents_show.push(content);
                          contentService.getContentByUID(content[i]).then(content =>{
                            setLogContent(content[i],activity_id,level,points);
                            showContent(content);
                          })
                          break bloco_showContent;
                        }else{
                          content = {content_id: content[i], viewed: true};
                          contents_show.push(content);
                        }
                      }
                    };
                    const all_viewed = contents_show.every(item => item.viewed === true);
                    if (all_viewed) {
                      var activity_content = {all_viewed};
                      activityContentsService.update(content_id,activity_content);
                    } 
                  });
                }else{ // Não foi respondida nenhuma visualizar a primeira.
                  var content_id = activitycontents[0].dados.contents[0];
                  contentService.getContentByUID(content_id).then(content =>{
                    setLogContent(content_id,activity_id,level,points);
                    showContent(content);
                  })
                }
              });
            }
          })
        })
      });
    }

    function showContent(content){
      title_text.innerHTML = `<span class="title_text"><img src="../../assets/images/key.png" width="30" height="30">${content.title}</span>`;
      didyouknow_text.innerHTML = `<span class="didyouknow_text"><img src="../../assets/images/alert.png" width="30" height="30"><strong>Mas atenção:</strong> ${content.did_you_know}</span>`;
      example_text.innerHTML = `<span class="example_text"><img src="../../assets/images/location.png" width="30" height="30">${content.example}</span>`;
      curiosity_text.innerHTML = `<span class="curiosity_text"><img src="../../assets/images/location.png" width="30" height="30">${content.curiosity}</span>`;
      tip_text.innerHTML = `<span class="tip_text"><img src="../../assets/images/location.png" width="30" height="30">${content.tip}</span>`;     
    }

    function setLogContent(content_id, activity_id, level, points){
      const now = new Date();
      const time = now.toLocaleTimeString('pt-BR');
      const data = now.toLocaleDateString('pt-BR');
      let points_new = points;
      let points_old = points; 

      var log_contents ={
        activity_id,
        content_id,
        data,
        time,
        level, 
        points_new, 
        points_old,
        user_UID
      };
      //gravar na Log as resposta selecionadas
      logContentService.save(log_contents);
    } 
  }
})

function voltar(){
  window.location.href = `../play/menu.html?activity_id=${activity_id}`;
}

function validarValor(valor) {
  if (valor === null) {
    return false;
  }
  return true;
}