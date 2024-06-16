let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:45vw; background-color:gray;";
    document.body.appendChild(div);
  };
  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };
  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts += 1;
    index = 0;
  };
  const keyboardCheck = (inputWord) => {
    const keyboardAnswer = document.querySelector(
      `.keyboard-column[data-key='${inputWord}']`
    );
    keyboardAnswer.style = "background-color:#6aaa64; color:white;";
  };

  const handleEnterKey = async () => {
    let answerWordCnt = 0;
    const response = await fetch("/answer");
    const answerObject = await response.json();
    const answer = answerObject.answer;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      const inputWord = block.innerText;
      const answerWord = answer[i];
      if (inputWord === answerWord) {
        answerWordCnt += 1;
        block.style.background = "#6AAA64";
        keyboardCheck(inputWord);
      } else if (answer.includes(inputWord)) {
        block.style.background = "#C9B458";
      } else block.style.background = "#787C7E";
      block.style.color = "white";
    }
    if (answerWordCnt === 5) gameover();
    else nextLine();
  };
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );
    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") {
        handleEnterKey();
      } else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };
  const handleClick = (event) => {
    const key = event.target.innerText;
    const backspace = document.querySelector(
      ".keyboard-column[data-key='BACK']"
    );
    const currentbox = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );
    if (event.key === backspace) {
      handleBackspace();
    }
    if (index === 5) {
      if (key === "ENTER") {
        handleEnterKey();
      }
      return;
    } else {
      currentbox.innerText = key;
      index += 1;
    }
  };
  const startTimer = () => {
    const startTime = new Date();

    function setTime() {
      const currentTime = new Date();
      const stopwatch = new Date(currentTime - startTime);
      const minute = stopwatch.getMinutes().toString().padStart(2, "0");
      const second = stopwatch.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${minute}:${second}`;
    }
    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("click", handleClick);
  window.addEventListener("keydown", handleKeydown);
}

appStart();
