/**
 * the options menu and the actual game
 * @type {{startScreen: string, gameScreen: string}}
 */
const states = {
  startScreen: 'startScreen',
  gameScreen: 'gameScreen',
};

/**
 * IDK
 * @type {null}
 */
let B = null;
let D = null;

/**
 * the arena width and height
 * @type {number}
 */
const AW = 800;
const AH = 600;

/**
 * the width and height of the letter tiles
 * @type {number}
 */
const TW = 50;
const TH = 50;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * a reusable class that comes with the width, height, class name, and that its in the arena
 */
class Sprite {

  constructor(className, w, h, arena) {
    this.w = w;
    this.h = h;
    this.xs = 0;
    this.ys = 0;
    this.element = D.createElement('div');
    this.element.className = `sprite ${className}`;
    this.element.style.width = w + 'px';
    this.element.style.height = h + 'px';
    arena.appendChild(this.element);
  }

  /**
   * deletes something
   */
  kill() {
    this.element.remove();
  }

  /**
   * where the tiles are positioned
   * @param x
   * @param y
   */
  positionSprite(x, y) {
    this.x = x;
    this.y = y;
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
  }

  /**
   * how fast they should go
   * @param xs
   * @param ys
   */
  setSpeed(xs, ys) {
    this.xs = xs;
    this.ys = ys;
  }

  /**
   * the letter on the tile
   * @param t
   */
  setText(t) {
    this.element.textContent = t;
  }

  /**
   * adds something to a class
   * @param c
   */
  addClass(c) {
    this.element.classList.add(c);
  }

  /**
   * idk
   */
  update() {
    this.positionSprite(this.x + this.xs, this.y + this.ys)
  }
}

/**
 * the way the whole game works
 */
class CameronsGame {

  /**
   * start everything
   */
  constructor() {
    D = document;
    B = D.body;
    this.nextState(states.gameScreen);
  }

  /**
   * switch to next state
   * @param newState
   */
  nextState(newState) {
    this.state = newState;
    switch (this.state) {
    case states.startScreen:
      this.startScreen();
      break;
    case states.gameScreen:
      this.gameScreen();
      break;
    }
  }

  /**
   * initialize the start screen
   */
  startScreen() {
    B.innerHTML = null;
    B.className = 'start-screen';

    B.insertAdjacentHTML('afterbegin', `
      <h1>Flying Letters</h1>
      <button id="startButton">Start</button>
    `);
    B.querySelector('#startButton').addEventListener('click', () => {
      this.nextState(states.gameScreen);
    });
  }

  /**
   * start the game
   */
  gameScreen() {
    B.innerHTML = null;
    B.className = 'game-screen';

    B.insertAdjacentHTML('beforeend', `
      <div class = "score">457653</div>
      <div class="timer">
        <div class="timer-inner"></div>
      </div>
      <div class="arena"></div>
      <div class="tray"></div>
      <button id="quit">End</button>
    `);

    this.tray = B.querySelector('.tray');
    this.arena = B.querySelector('.arena');
    this.timerInner = B.querySelector('.timer-inner');
    this.scoreBox = B.querySelector('.score');

    B.querySelector('#quit').addEventListener('click', () => {
      this.nextState(states.startScreen);
    });

    this.setWord();

    this.remainingTime = 100;
    this.score = 0;

    this.npc = [];
    this.tiles = [];
    requestAnimationFrame(this.gameLoop);

    B.addEventListener('click', this.onClick);

  }

  findTileSprite(e) {
    return this.tiles.find((sprite) => {
      return sprite.element === e;
    });
  }

  /**
   * everything that happens when you click on a tile
   * @param e
   */
  onClick = (e) => {
    if (e.target.hasAttribute("data-tile")) {
      const letter = e.target.getAttribute("data-tile");
      let found = false;
      for (let i = 0; i < this.wordTracker.length; i += 1) {
        const obj = this.wordTracker [i];
        if (obj.letter === letter && obj.clicked === false) {
          obj.clicked = true;
          obj.sprite.addClass("clicked");

          const sprite = this.findTileSprite(e.target);
          sprite.kill();
          this.tiles = this.removeArray(this.tiles, sprite);
          this.remainingTime = Math.min(100, this.remainingTime + 10);
          found = true;
          this.score += 1000;
          break;
        }
      }
      this.remainingTime = Math.max(0, this.remainingTime -= 10);
      this.testFinished();
    } else {
      this.remainingTime = Math.max(0, this.remainingTime -= 10);
    }
  }

  testFinished() {
    const done = this.wordTracker.every((obj) => {
      return obj.clicked;
    });
    if (done === true) {
      this.setWord();
      this.remainingTime = Math.min(100, this.remainingTime +=20);
    }

  }

  /**
   * main game loop
   */
  gameLoop = () => {

    this.remainingTime = Math.max(0, this.remainingTime - 0.05);
    this.timerInner.style.width = this.remainingTime + "%";
    this.score += 1;
    this.scoreBox.textContent = this.score;
    if (Math.random() > 0.90) {
      let s = new Sprite('tile', TW, TH, this.arena);
      s.positionSprite(-100, Math.random() * (AH - 100));
      s.setSpeed(1 + Math.random() * 3, 0);
      const letter = this.randomArray(letters)
      s.setText(letter);
      s.element.setAttribute("data-tile", letter);
      this.npc.push(s);
      this.tiles.push(s);
    }

    this.npc.forEach((s) => {
      s.update();
    });

    this.tiles.forEach((s) => {
      if (s.x > AW) {
        this.npc = this.npc.filter(sp => sp !== s);
        this.tiles = this.tiles.filter(sp => sp !== s);
        s.kill();
      }
    });
    if (this.remainingTime === 0) {
      this.nextState(states.startScreen);
    }
    if (this.state === states.gameScreen) {
      requestAnimationFrame(this.gameLoop);
    }
  };

  setWord() {
    this.word = this.randomArray(WORDS);
    this.wordTracker = [];
    this.tray.innerHTML = null;
    this.word.split('').forEach(letter => {
      let s = new Sprite('tile', TW, TH, this.tray);
      s.setText(letter);
      const obj = {
        letter: letter,
        sprite: s,
        clicked: false,
      };
      this.wordTracker.push(obj);
    })
  }

  /**
   * return a value is >= minValue and < maxValue
   * @param minValue
   * @param maxValue
   */
  randomInteger(minValue, maxValue) {
    return minValue + Math.floor(Math.random() * (maxValue - minValue));
  }

  randomArray(a) {
    return a[this.randomInteger(0, a.length)];
  }

  /**
   *removes the letter we clicked from list of letters we still have to click
   * @param a
   * @param v
   * @returns {Array.<T>|*}
   */
  removeArray(a, v) {
    return a.filter((element) => {
      return element != v;
    });
  }

}

/**
 * start the game running
 */
window
  .onload = () => {
  new CameronsGame();
};
