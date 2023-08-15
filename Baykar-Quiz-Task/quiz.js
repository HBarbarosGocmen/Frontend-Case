let currentQuestionIndex = 0;
let timer;
const answers = [];
let questions = [];

async function fetchData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    console.log("Data fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function initializeQuiz() {
  try {
    const data = await fetchData();
    if (data) {
      questions = data.slice(0, 10).map((item, index) => {
        const parsedAnswers = item.body
          .split("\n")
          .map((answer, index) => `${String.fromCharCode(65 + index)}) ${answer}`);
        
        return {
          question: `${index + 1}) ${item.title} ?`,
          choices: parsedAnswers,
          correctAnswer: "A",
        };
      });
      displayQuestion();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const choicesElement = document.getElementById("choices");
  const timerElement = document.getElementById("timer");

  if (currentQuestionIndex < questions.length) {
    const { question, choices } = questions[currentQuestionIndex];
    questionElement.textContent = question;
    choicesElement.innerHTML = "";

    choices.forEach((choice) => {
      const button = createChoiceButton(choice);
      choicesElement.appendChild(button);
    });

    timerElement.textContent = "30";
    startTimer();
    canAnswer = false;
  } else {
    showResult();
  }
}

function createChoiceButton(choice) {
  const button = document.createElement("button");
  button.textContent = choice;
 

  button.disabled = true;

  button.addEventListener("click", () => {
    answerQuestion(choice);
  });

  return button;
}

function startTimer() {
  let timeLeft = 30;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft === 0) {
      answerQuestion("");
    }
  }, 1000);

  setTimeout(() => {
    canAnswer = true;
    const buttons = document.querySelectorAll("#choices button");
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }, 10000);
}

function answerQuestion(answer) {
  clearInterval(timer);
  answers.push({ question: questions[currentQuestionIndex].question, answer });
  currentQuestionIndex++;
  displayQuestion();
}

function showResult() {
  const quizContainer = document.getElementById("quiz-container");
  const resultContainer = document.getElementById("result-container");
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  const resultTable = document.getElementById("result-table");
  answers.forEach((entry) => {
    const row = document.createElement("tr");
    const questionCell = document.createElement("td");
    const answerCell = document.createElement("td");
    questionCell.textContent = entry.question;
    answerCell.textContent = entry.answer;
    row.appendChild(questionCell);
    row.appendChild(answerCell);
    resultTable.appendChild(row);
  });
}

initializeQuiz();
