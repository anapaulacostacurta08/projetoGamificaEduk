firebase.auth().onAuthStateChanged( (User) => {
  if (User) {
    const questionsList = document.getElementById('questionUid');
    questionsList.innerHTML = ''; // Limpa a lista de perguntas

    document.getElementById("search-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      const level = document.getElementById("level").value;
      const category = document.getElementById("category").value;
      questionService.getQuestionsByLevelCategory(level,category).then(questions => {
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
            questionsLevel.appendChild(listItem);
          });
      }).catch(error => {
          alert('Erro ao carregar perguntas:'+error.message);
      });
    });
  }
})

