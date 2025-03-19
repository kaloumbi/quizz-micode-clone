import "./style.css";

//Variable TimeOut
const TIMEOUT = 4000;

//importer questions.js
import { Questions } from "./questions";

// console.log("table", Questions);
const app = document.querySelector("#app");

const startButton = document.querySelector("#start");

startButton.addEventListener("click", startQuizz);

//methode de stockage d'information
function startQuizz(ev) {
  ev.stopPropagation();

  let currentQuestion = 0;
  let score = 0;

  //affichage de question
  displayQuestion(currentQuestion);

  // fonction de reinitialisation
  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }

    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  //fonction d'affichage de la question
  function displayQuestion(index) {
    clean();
    const question = Questions[index];

    if (!question) {
      //finish quizz
      displayFinishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);

    const answerDiv = createAnswers(question.answers);
    app.appendChild(answerDiv);

    //button de soumission
    const submitButton = getSubmitButton();

    submitButton.addEventListener("click", submit);
    submitButton.removeEventListener;

    app.appendChild(submitButton);
  }

  //fonction pour terminer le message
  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! Tu as terminé le quizz.";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} points !`;

    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit() {
    //desactiver les autres radio button après soumission
    disableAllAnswers();

    const selectedAnswer = app.querySelector('input[name="answer"]:checked');

    if (!selectedAnswer) {
      alert(`Veuillez choisir une option avant de soumettre !`);
      return;
    }

    const value = selectedAnswer.value;

    //verifier si la reponse est correcte
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    displayNextQuestionButton();

    const feeback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feeback);
  }

  //fonction pour afficher l'interface
  function displayNextQuestionButton() {
    let remainingTimeout = TIMEOUT;

    //supprimer le boutton start
    app.querySelector("button").remove();

    const nextButton = document.createElement("button");
    nextButton.innerText = `Next(${remainingTimeout / 1000}s)`;
    app.appendChild(nextButton);

    const interval = setInterval(() => {
      remainingTimeout -= 1000;
      nextButton.innerText = `Next (${remainingTimeout / 1000}s)`;
    }, 1000);

    const timeOut = setTimeout(() => {
      handleNextQuestion();
    }, TIMEOUT);

    const handleNextQuestion = () => {
      currentQuestion++;
      clearInterval(interval);
      clearTimeout(timeOut);
      displayQuestion(currentQuestion);
    };

    nextButton.addEventListener("click", () => {
      handleNextQuestion();
    });
  }

  function createAnswers(answers) {
    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answerDiv.appendChild(label);
    }

    return answerDiv;
  }
}

// Fonction nous permettant de recuperer le titre
function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerHTML = text;
  return title;
}

//Fonction de formatage Id
function formatId(text) {
  return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

//Fonction de creation de reponse
function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);

  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

//fonction feeback
function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatId(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

//fonction du message de notification
function getFeedbackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect
    ? "Bravo ! Tu as eu la bonne réponse"
    : `Désolé... mais la bonne réponse était ${correct} `;

  return paragraph;
}

//fonction pour afficher la barre de progression
function getProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);

  return progress;
}

//fonction nous permettant de tout desactiver
function disableAllAnswers() {
  const inputRadio = document.querySelectorAll('input[type="radio"]');

  for (const radio of inputRadio) {
    radio.disabled = true;
  }
}
