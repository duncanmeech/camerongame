const states = {
  startScreen: 'startScreen',
  gameScreen: 'gameScreen',
};

let B = null;
let D = null;

const AW = 800;
const AH = 600;

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
    this.nextState(states.startScreen);
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

    this.arena = new Sprite('arena', AW, AH, B);

    B.insertAdjacentHTML('beforeend', `
      <br>
      <button id="quit">End</button>
    `);

    B.querySelector('#quit').addEventListener('click', () => {
      this.nextState(states.startScreen);
    });

    this.npc = [];
    this.stars = [];
    requestAnimationFrame(this.gameLoop);

  }

  /**
   * main game loop
   */
  gameLoop = () => {

    if (Math.random() > 0.95) {
      //at least 25, but no more than 100
      const sz = 25 + Math.random() * 75;
      const classes = ['red', 'green', 'blue'];
      const className = classes[Math.floor(Math.random() * 3)];
      let s = new Sprite(className, sz, sz, this.arena.element);
      s.positionSprite(-100, Math.random() * (AH - 100));
      s.setSpeed(1 + Math.random() * 3, 0);
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
  }
}

/**
 * start the game running
 */
window.onload = () => {
  new CameronsGame();
};