firebase.auth().onAuthStateChanged( (User) => {
  if (User) {
    const card_questions = document.getElementById('card-questions');
    card_questions.innerHTML = ''; // Limpa a lista de perguntas

    document.getElementById("search-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      const level = document.getElementById("level").value;
      const category = document.getElementById("category").value;
      questionsService.getQuestionsByLevelCategory(category,level).then(questions => {
          questions.forEach(question => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <p><strong>numb:</strong> ${question.numb}</p>
              <p><strong>Pergunta:</strong> ${question.text}</p>
              <p><strong>Category:</strong> ${question.category}</p>
              <p><strong>Tipo Questão:</strong> ${question.type}</p>
              <p><strong>Level:</strong> ${question.level}</p>              
              <p><strong>Respostas:</strong> ${question.options}</p>
              <p><strong>Resposta Correta:</strong> ${question.answer}</p>
            `;
            card_questions.appendChild(listItem);
          });
      }).catch(error => {
          alert('Erro ao carregar perguntas:'+error.message);
      });
    });
  }
})

function popularSelectActivities() {
  firebase.auth().onAuthStateChanged( (User) => {
    if (User){
      let Activities = document.getElementById("activities");
      activityService.getActivitiesActives().then( activities => {
        activities.forEach(activity => {
          Activities.innerHTML = Activities.innerHTML + `<option value="${activity.uid}">${activity.dados.name}</option>`;
        });
      })
    }
  })
}

