
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
    this.element = D.createElement('div');
    this.element.className = `sprite ${className}`;
    this.element.style.width = w + 'px';
    this.element.style.height = h + 'px';
    arena.appendChild(this.element);
  }

  positionSprite(x, y) {
    this.x = x;
    this.y = y;
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
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

    let s = new Sprite('red', 100, 100, this.arena.element);
    s.positionSprite(100, 100);

    s = new Sprite('red', 50, 50, this.arena.element);
    s.positionSprite(200, 200);

    s = new Sprite( 'blue', 25, 25, this.arena.element);
    s.positionSprite(250, 250);

    var xpos1 = 0;
    s = new Sprite('blue', 50, 50, this.arena.element);
    const mainLoop = () => {
      xpos1 += 1;
      s.positionSprite(xpos1,100);
      requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
  }


}

/**
 * start the game running
 */
window.onload = () => {
  new CameronsGame();
};