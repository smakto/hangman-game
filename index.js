let lt = [
  "Miškas",
  "Laikas",
  "Tauras",
  "Puodas",
  "Šimtas",
  "Adata",
  "Marsas",
  "Naujas",
  "Žmogus",
  "Įmonė",
  "Niekas",
  "Viskas",
  "Bendras",
  "Kaunas",
  "Baltas",
  "Juodas",
  "Pilkas",
  "Kaimas",
  "Vilnius",
  "Linija",
];
let wordDiv = document.getElementById("theWord");
let randNum = Math.floor(Math.random() * lt.length - 1) + 1;
let wordToGuess = lt[randNum].toUpperCase();
let hidden = "";
let incorrectLetters = [];
let outcomeAlert = document.createElement("h1");
let turns = 6;
let turnCounter = document.querySelector("h4");

function theGame() {
  turnCounter.innerText = `Liko ${turns} spėjimai.`;

  for (let i = 0; i < wordToGuess.length; i++) {
    hidden += "_";
  }

  let hiddenArray = Array.from(hidden);
  wordDiv.innerText = hidden;
  let myForm = document.forms[1];

  myForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputValue = myForm.elements.letter.value;
    let inputValueCapitalized = inputValue.toUpperCase();
    if (!/^[a-zA-Z\-_ĄąČčĘęĖėĮįŠšŲųŪūŽž]/.test(inputValueCapitalized)) {
      document.getElementById("errorField").innerText =
        "Prašome įvesti vieną RAIDĘ.";
      myForm.elements.letter.value = "";
    } else if (inputValue.length > 1) {
      document.getElementById("errorField").innerText =
        "Prašome įvesti VIENĄ raidę.";
      myForm.elements.letter.value = "";
    } else if (wordToGuess.includes(inputValueCapitalized)) {
      for (let k = 0; k < wordToGuess.length; k++) {
        if (inputValueCapitalized === wordToGuess[k]) {
          hiddenArray.splice(k, 1, inputValueCapitalized);
        }
      }
    } else {
      if (!incorrectLetters.includes(inputValueCapitalized)) {
        incorrectLetters.push(inputValueCapitalized);
        turns = turns - 1;
      }
      document.querySelector(
        "h3"
      ).innerText = `Žodyje nėra: ${incorrectLetters}`;
    }

    turnCounter.innerText = `Liko ${turns} spėjimai.`;
    if (turns === 0) {
      turnCounter.innerText = `Žaidimas baigėsi.`;
      turnCounter.style.color = "red";
      myForm.elements.letter.disabled = true;
      document.body.appendChild(outcomeAlert);
      outcomeAlert.innerText = `Neatspėjote "${wordToGuess}". Jūsų laikas ${
        seconds - 1
      } sek.`;

      outcomeAlert.style.color = "red";
      clearInterval(setTime);
    }

    let result = hiddenArray.join("");
    wordDiv.innerText = result;

    if (!result.includes("_")) {
      document.body.appendChild(outcomeAlert);
      outcomeAlert.innerText = `Valio! Atspėjote "${wordToGuess}". Jūsų laikas ${
        seconds - 1
      } sek.`;
      outcomeAlert.style.color = "green";
      clearInterval(setTime);
    }
  });

  myForm.elements.letter.addEventListener("focus", (event) => {
    document.getElementById("errorField").innerText = "";
    myForm.elements.letter.value = "";
  });

  let resetButton = document.querySelector("input[type=button");

  resetButton.addEventListener("click", () => {
    location.reload();
  });
}

let formLangSelect = document.forms[0];
let timeDiv = document.querySelector("div.timer");
timeDiv.innerText = "Laikas:";
timeDiv.style.visibility = "hidden";
document.forms[1].style.visibility = "hidden";

let setTime;
let seconds = 0;

let theLanguage;

formLangSelect.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();
    theLanguage = document.forms[0].elements.langselect.value;

    if (theLanguage === "lt") {
      theGame();
    } else if (document.forms[0].elements.langselect.value !== "lt") {
      const result = await langPack(theLanguage);
      wordToGuess = result[0].toUpperCase();
      theGame();
    }
    formLangSelect.style.visibility = "hidden";
    timeDiv.style.visibility = "visible";
    document.forms[1].style.visibility = "visible";

    setTime = setInterval(function () {
      timeDiv.innerText = `Laikas: ${seconds} sekundės.`;
      seconds++;
    }, 1000);
  },
  { once: true }
);

let langPack = async function (lang) {
  try {
    let languages = await fetch(
      `https://random-word-api.herokuapp.com/word?lang=${lang}`
    );
    languages = await languages.json();
    return languages;
  } catch (e) {
    console.error("langPack", e);
  }
};
