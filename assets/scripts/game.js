// # Configurações
const secondsToWaitBeforeFlip = 5000; // miliseconds
const definedUserChances = 5;
const lastCardSelectedInitial = {
  id: null,
  index: null,
};

// # DOMs
let cardListDOM = null;
let scorePointsDOM = null;

// # Application Flags
let isReadyToSelectCard = false;
let lastCardSelected = lastCardSelectedInitial;
let userChances = definedUserChances;
let userScore = 0;

const handler = () => {
  const run = () => {
    cardListDOM = document.getElementById("cards-list");
    scorePointsDOM = document.getElementById("score-points");
  };

  const resetGame = () => {
    isReadyToSelectCard = false;
    lastCardSelected = lastCardSelectedInitial;
    cardListDOM.innerHTML = "";
    userScore = 0;
    userChances = definedUserChances;
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const showScreen = (screen) => {
    document.body.className = `${screen}-open`;
  };

  const getShuffledCards = () => {
    return [...CARDS, ...CARDS]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const gameOver = () => {
    scorePointsDOM.innerHTML = userScore;
    isReadyToSelectCard = false;
    showScreen("score");
  };

  const selectCard = (cardIndex) => {
    if (!isReadyToSelectCard) return;

    const cardDOM = document.getElementById(`card-${cardIndex}`);
    cardDOM.classList.remove("flipped");

    setTimeout(() => {
      const cardId = cardDOM.dataset.cardId;

      if (!lastCardSelected.id) {
        lastCardSelected = {
          id: cardId,
          index: cardIndex,
        };
        return;
      }

      const lastSelectedCardDOM = document.getElementById(
        `card-${lastCardSelected.index}`
      );

      // Right! A new point!
      if (lastCardSelected.id === cardId) {
        userScore += 1;

        cardDOM.classList.add("correct");
        lastSelectedCardDOM.classList.add("correct");

        lastCardSelected = lastCardSelectedInitial;
        return;
      }

      // Wrong! So get flip cards back and reset flags
      lastSelectedCardDOM.classList.add("flipped");
      cardDOM.classList.add("flipped");

      lastCardSelected = lastCardSelectedInitial;

      userChances -= 1;

      // is game over?
      if (userChances <= 0) {
        return gameOver();
      }
    }, 700);
  };

  const flipAllCardsDown = () => {
    const cards = document.getElementsByClassName("card");
    for (let card of cards) {
      if (!card.classList.contains("logo")) card.classList.add("flipped");
    }

    isReadyToSelectCard = true;
  };

  const startNewGame = () => {
    resetGame();

    // Open Game Screen
    showScreen("game");

    //Shuffle Cards and put them on list
    const shuffledCards = getShuffledCards();

    let html = "";

    shuffledCards.forEach((card, index) => {
      if (index === Math.floor(shuffledCards.length / 2)) {
        html += `
            <div class="card logo">
              <button type="button" style="background-image: url('assets/images/card-logo.jpg')"> 
              </button>
            </div>
          `;
      }

      html += `
          <div class="card" id="card-${index}" data-card-id="${card.id}" >
            <button type="button" onclick="javascript:gameHandler.selectCard('${index}')" style="background-image: url('assets/images/${card.id}.jpg')">
            </button>
          </div>
        `;
    });

    cardListDOM.innerHTML = html;

    // After X seconds, flip cards down
    setTimeout(() => {
      flipAllCardsDown();
    }, secondsToWaitBeforeFlip);
  };

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return {
    run,
    startNewGame,
    selectCard,
  };
};

var gameHandler = handler();

window.addEventListener("load", () => {
  gameHandler = handler();
  gameHandler.run();
});
