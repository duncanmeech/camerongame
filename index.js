const states = {
  startScreen: 'startScreen',
  gameScreen: 'gameScreen',
};

let B = null;
let D = null;

const AW = 800;
const AH = 600;

const TW = 50;
const TH = 50;

const words = ['LIGHTNING', 'PLATYPUS', 'DEMENTED', 'ONOMATOPOEIA', 'YOUTHQUAKE', 'SKIING', 'DRAGON'];
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

  kill() {
    this.element.remove();
  }

  positionSprite(x, y) {
    this.x = x;
    this.y = y;
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
  }

  setSpeed(xs, ys) {
    this.xs = xs;
    this.ys = ys;
  }

  setText(t) {
    this.element.textContent = t;
  }

  update() {
    this.positionSprite(this.x + this.xs, this.y + this.ys)
  }
}

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
      <h1>Cameron's Game</h1>
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
      <div class="arena"></div>
      <div class="tray"></div>
      <button id="quit">End</button>
    `);

    this.tray = B.querySelector('.tray');
    this.arena = B.querySelector('.arena');

    B.querySelector('#quit').addEventListener('click', () => {
      this.nextState(states.startScreen);
    });

    this.setWord();

    this.npc = [];
    this.stars = [];
    requestAnimationFrame(this.gameLoop);

  }

  /**
   * main game loop
   */
  gameLoop = () => {

    if (Math.random() > 0.95) {
      let s = new Sprite('tile', TW, TH, this.arena);
      s.positionSprite(-100, Math.random() * (AH - 100));
      s.setSpeed(1 + Math.random() * 3, 0);
      s.setText(this.randomArray(letters));
      this.npc.push(s);
      this.stars.push(s);
    }

    this.npc.forEach((s) => {
      s.update();
    });

    this.stars.forEach((s) => {
      if (s.x > AW) {
        this.npc = this.npc.filter(sp => sp !== s);
        this.stars = this.stars.filter(sp => sp !== s);
        s.kill();
      }
    });

    if (this.state === states.gameScreen) {
      requestAnimationFrame(this.gameLoop);
    }
  };

  setWord() {
    this.word = this.randomArray(words);
    this.tray.innerHTML = null;
    this.word.split('').forEach(letter => {
      let s = new Sprite('tile', TW, TH, this.tray);
      s.setText(letter);
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

}

/**
 * start the game running
 */
window.onload = () => {
  new CameronsGame();
};
