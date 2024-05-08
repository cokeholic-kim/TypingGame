let paragraph;
let allLength;

const errors = document.querySelector(".topBoard .errors .value");
const time = document.querySelector(".topBoard .time .value");
const accuracy = document.querySelector(".topBoard .accuracy .value");

const mainBoard = document.querySelector(".mainBoard .paragraph");
const userBoard = document.querySelector(".userBoard input");

//게임 사양
let errorsCount = 0;
let TimeCount = 20;
let accuracyCount = 100;
let gameCount = 0;
let maxCount = 10;

async function getData() {
    try {
      const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${maxCount}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
}

getData().then((data) => {
    console.log(data.length);
    paragraph = data;
    allLength = paragraph.reduce((total, length) => total + length, 0).length;

    gameStart()
});

userBoard.addEventListener("input",handleInput)
userBoard.addEventListener("keyup",handleEnter)

const gameStart = () => {
    errors.innerText = errorsCount;
    time.innerText = TimeCount + " S";
    accuracy.innerText = accuracyCount;

    nextParagraph()
}

function nextParagraph(){
    mainBoard.innerText = paragraph[gameCount];
    gameCount++;
    if(gameCount >= maxCount){
        alert("Game count reached");
    }
}

function handleEnter(event){

    let inputValue = event.target.value;
    let paragraphValue = mainBoard.innerText;

    if (event.keyCode === 13) {
        //엔터키를 눌렀을때 실행
        TimeCount = 20;
        time.innerText = TimeCount + " S";
        errorsCount = typeErrorCount(inputValue,paragraphValue);
        userBoard.value = "";
        nextParagraph();
    }
}

setInterval(() => {
    TimeCount--;
    time.innerText = TimeCount + " S";
    if(TimeCount <= 0){
        TimeCount = 20;
        errorsCount += mainBoard.innerText.length;
        userBoard.value = "";
        nextParagraph();
    }
}, 1000);

function handleInput(event){
    let inputValue = event.target.value;
    let paragraphValue = mainBoard.innerText;
    let output = '';
    let error = '';

    //입력값의 길이가 목표값보다 길어질때 undefinded 방지
    if(inputValue.length > paragraphValue.length){
        event.target.blocked = true;
        return;
    }

    // 입력된 값과 원본 값을 비교하여 색상 적용
    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] === paragraphValue[i]) {
            //입력값과 일치하는경우
            output += `<span style="color: green;">${paragraphValue[i]}</span>`;
        } else {
            //입력값과 일치하지 않는경우
            output += `<span style="color: red;">${paragraphValue[i]}</span>`;
            error++;
        }
    }


    // 아직 입력되지 않은 부분은 원본 색상으로 표시
    if (inputValue.length < paragraphValue.length) {
        output += `<span>${paragraphValue.substring(inputValue.length)}</span>`;
    }
    
    // 메인 보드 업데이트
    mainBoard.innerHTML = output;
    typeErrorCount(inputValue,paragraphValue);
    typeAccuracyCount(error,paragraphValue)
}

function typeErrorCount(inputValue,paragraphValue){
    let currentError = errorsCount;

    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] != paragraphValue[i]) {
            currentError++;
        }
    }

    errors.innerText = currentError;
    return currentError;
}

function typeAccuracyCount(error,paragraphValue){
    accuracyCount = 100 - (error / paragraphValue.length) * 100;
    accuracy.innerText = Math.floor(accuracyCount);

    return accuracyCount;
}

//입력시 오타 부분계산
//입력시 정확도 계산

//엔터 오타 누적 
//정확도 재 계산


