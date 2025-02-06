firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
      sessionStorage.clear;
      window.location.href = "../login/login.html";
  }
})
var user_UID = sessionStorage.userUid;
var score_total = sessionStorage.score_total + " points";
var nameUser = sessionStorage.nameUser;

// Captura o evento de envio do formulário
document.getElementById("quiz-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;
  const level = document.getElementById("level").value;
  const text = document.getElementById("text").value;
  const options = document.getElementById("options").value.split(",").map(option => option.trim()); // Divide as opções
  const answer = document.getElementById("answer").value.split(",").map(answer => answer.trim());
  const feedback_correct = document.getElementById("feedback_correct").value;
  const feedback_incorrect = document.getElementById("feedback_incorrect").value;

  // Cria o objeto para salvar o quiz
  const newQuiz = {
    category,
    type,
    level,
    text,
    options,
    answer,
    feedback_correct,
    feedback_incorrect
  };

  // Chama a função para salvar o quiz no Firestore
  questionService.save(newQuiz);

  // Limpa o formulário após o envio
  document.getElementById("quiz-form").reset();
});

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../index.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}