// Global containers
const container = document.querySelector('.container');
const blurContainer = document.querySelector('#blur-container');
const board = document.querySelector('#board');
const boxes = document.querySelectorAll('#board > div');

// Form
const form = document.querySelector('.player-identity');
const formInput = form.querySelectorAll('input');
const playerIdentityBtn = form.querySelector('button');

// Popups
const winnerDisplay = document.querySelector('.winner');
const winnerName = winnerDisplay.querySelector('span');
const playAgainBtn = winnerDisplay.querySelector('button');

// Numbers
const scorePlayerA = document.querySelector('.player-a');
const scorePlayerB = document.querySelector('.player-b');
const turnCount = document.querySelector('.turn-value');

const Gameboard = (function () {
  'use strict';

  // Set up the empty board array
  let _boardArray = [];
  _boardArray.length = 9;

  // Display the board at each move
  function _displayBoard() {
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].textContent = _boardArray[i];
      boxes[i].style.background = _boardArray[i + 9];
    }
  }

  // Get the input from player interaction
  function displayPlayerInput() {
    let index = Array.prototype.indexOf.call(this.parentNode.children, this);
    if (_boardArray[index] !== undefined) {
      console.log('This spot is taken!');
    } else {
      // Get the right player according to turn count
      let _player = Game.setTurn();
      _boardArray[index] = _player.getSign();
      _boardArray[index + 9] = _player.getColor();
      Game.playTurn();
      _displayBoard();
    }
  }

  function spieArray() {
    for (let i = 0; i < 3; i++) {
      // If columns got the same sign
      if (
        _boardArray[i] !== undefined &&
        _boardArray[i] === _boardArray[i + 3] &&
        _boardArray[i] === _boardArray[i + 6]
      ) {
        return _boardArray[i];
      }
      // If rows got the same sign
      if (
        _boardArray[3 * i] !== undefined &&
        _boardArray[3 * i] === _boardArray[3 * i + 1] &&
        _boardArray[3 * i] === _boardArray[3 * i + 2]
      ) {
        return _boardArray[3 * i];
      }
    }
    // If diagonals got the same sign
    if (
      (_boardArray[0] !== undefined &&
        _boardArray[0] === _boardArray[4] &&
        _boardArray[0] === _boardArray[8]) ||
      (_boardArray[2] !== undefined &&
        _boardArray[2] === _boardArray[4] &&
        _boardArray[2] === _boardArray[6])
    ) {
      return _boardArray[4];
    }
  }

  function reset() {
    _boardArray = [];
    _boardArray.length = 9;
    _displayBoard();
    for (const box of boxes) {
      box.removeAttribute('style');
    }
  }

  return {
    displayPlayerInput: displayPlayerInput,
    spieArray: spieArray,
    reset: reset,
  };
})();

const Game = (function () {
  'use strict';

  playerIdentityBtn.addEventListener('click', _getPlayerIdentity);

  let count = 0;
  let _playerA;
  let _playerB;

  function _getPlayerIdentity() {
    if (formInput[0].value === '') {
      formInput[0].value = 'Player A';
    }
    if (formInput[1].value === '') {
      formInput[1].value = 'X';
    }
    if (formInput[3].value === '') {
      formInput[3].value = 'Player B';
    }
    if (formInput[4].value === '') {
      formInput[4].value = 'Y';
    }

    _playerA = Player(
      formInput[0].value,
      formInput[1].value,
      _getRGBA(formInput[2].value),
    );
    _playerB = Player(
      formInput[3].value,
      formInput[4].value,
      _getRGBA(formInput[5].value),
    );

    scorePlayerA.querySelector('span').textContent = `${formInput[0].value} :`;
    scorePlayerB.querySelector('span').textContent = `${formInput[3].value} : `;
    scorePlayerA.querySelector('span + span').textContent = 0;
    scorePlayerB.querySelector('span + span').textContent = 0;
    scorePlayerA.classList.add('score');
    scorePlayerB.classList.add('score');

    playerIdentityBtn.removeEventListener('click', _getPlayerIdentity);
    blurContainer.classList.remove('blur');
    form.classList.add('hide');

    setTimeout(() => {
      form.style.display = 'none';
      _addPlayerInput();
    }, 501);
  }

  function setTurn() {
    if (count % 2 === 0) {
      return _playerA;
    } else {
      return _playerB;
    }
  }

  function playTurn() {
    _getResult();
    count++;
    turnCount.textContent = count;
  }

  function _getResult() {
    // Get the winning sign from the array without accessing it
    let _winnerSign = Gameboard.spieArray();
    if (_winnerSign !== undefined && setTurn().getSign() === _winnerSign) {
      _displayWinner(setTurn());
    } else if (count === 8) {
      _displayWinner('tie');
    }
  }

  function _addPlayerInput() {
    boxes.forEach((box) => {
      box.addEventListener('click', Gameboard.displayPlayerInput);
    });
  }

  function _removePlayerInput() {
    boxes.forEach((box) => {
      box.removeEventListener('click', Gameboard.displayPlayerInput);
    });
  }

  function _displayWinner(winner) {
    if (winner === 'tie') {
      winnerName.textContent = "That's a tie...";
    } else {
      winnerName.textContent = `${winner.playerName} wins!`;
      winner.score++;
      scorePlayerA.querySelector('span + span').textContent = _playerA.score;
      scorePlayerB.querySelector('span + span').textContent = _playerB.score;
    }
    _removePlayerInput();
    winnerDisplay.style.display = 'flex';
    winnerDisplay.classList.remove('hide');
    blurContainer.classList.add('blur');
    playAgainBtn.addEventListener('click', _playAgain);
  }

  function _playAgain() {
    Gameboard.reset();
    count = 0;
    turnCount.textContent = 0;

    blurContainer.classList.remove('blur');
    winnerDisplay.classList.add('hide');
    setTimeout(() => {
      winnerDisplay.style.display = 'none';
      _addPlayerInput();
    }, 501);
  }

  function _getRGBA(h) {
    let r = 0;
    let g = 0;
    let b = 0;

    // 3 digits
    if (h.length == 4) {
      r = '0x' + h[1] + h[1];
      g = '0x' + h[2] + h[2];
      b = '0x' + h[3] + h[3];

      // 6 digits
    } else if (h.length == 7) {
      r = '0x' + h[1] + h[2];
      g = '0x' + h[3] + h[4];
      b = '0x' + h[5] + h[6];
    }

    return `rgba(${+r}, ${+g}, ${+b}, 0.3)`;
  }

  return {
    setTurn: setTurn,
    playTurn: playTurn,
  };
})();

const Player = (name, sign, color) => {
  const playerName = name;
  let score = 0;
  const getSign = () => {
    return sign;
  };
  const getColor = () => {
    return color;
  };
  return { playerName, score, getSign, getColor };
};
