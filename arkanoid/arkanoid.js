const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600
const PLAYER_LENGTH = 75
const PLAYER_INITIAL_POSITION = 250
const PLAYER_WIDTH = 75
const PLAYER_HEIGHT = 10
const BALL_LENGHT = 6
const BALL_INITIAL_X = 294
const BALL_INITIAL_Y = 400
const BALL_VELOCITY = 5
const BALL_COLLISION_X_NEGATIVE = BALL_LENGHT
const BALL_COLLISION_X_POSITIVE = CANVAS_WIDTH - BALL_LENGHT
const BALL_COLLISION_Y_NEGATIVE = BALL_LENGHT / 2 + 1
const BALL_COLLISION_Y_POSITIVE = CANVAS_HEIGHT - BALL_LENGHT / 2 + 1

const DIRECTION_UP = 'up'
const DIRECTION_RIGHT = 'right'
const DIRECTION_DOWN = 'down'
const DIRECTION_LEFT = 'left'

// const BALL_NEXT_DIRECTION = {
//   [DIRECTION_UP]: DIRECTION_RIGHT,
//   [DIRECTION_RIGHT]: DIRECTION_DOWN,
//   [DIRECTION_DOWN]: DIRECTION_LEFT,
//   [DIRECTION_LEFT]: DIRECTION_UP
// }

const canvas = document.querySelector('canvas')
const button = document.querySelector('button')

const ctx = canvas.getContext('2d')

let requestId
let player = PLAYER_INITIAL_POSITION
let lastUpdatedTime = performance.now()
let count = 0

const keyState = {}
const ball = {
  x: BALL_INITIAL_X,
  y: BALL_INITIAL_Y,
  directions: [DIRECTION_DOWN]
}

const sprite = new Image()

sprite.src = './assets/sprite.png'
sprite.onload = function () {
  drawPlayer()
  drawBall()
}

function drawPlayer() {
  ctx.beginPath()
  ctx.drawImage(
    sprite,
    28,
    174,
    49,
    8,
    player,
    553,
    PLAYER_LENGTH,
    PLAYER_HEIGHT
  )
}

function drawBall() {
  ctx.beginPath()

  ctx.arc(ball.x, ball.y, BALL_LENGHT, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'lightgrey'
  ctx.stroke()
}

function checkCollision() {
  const playerLeft = player - 3
  const playerRight = player + 78
  const currentX = Math.floor(ball.x)
  const currentY = Math.floor(ball.y)
  const leftAngle = currentX - playerLeft
  const rightAngle = playerRight - currentX
  const isLeft = leftAngle < rightAngle

  if (
    currentY >= 547 &&
    currentY <= 550 &&
    playerLeft <= currentX &&
    playerRight >= currentX
  ) {
    ball.directions = [DIRECTION_UP]
    if (isLeft) {
      ball.directions = [...ball.directions, DIRECTION_LEFT]
    } else {
      ball.directions = [...ball.directions, DIRECTION_RIGHT]
    }
  } else if (
    currentX === BALL_COLLISION_X_NEGATIVE || 
    currentX === BALL_COLLISION_X_POSITIVE
  ) {
    ball.directions = ball.directions.map(
      (direction) => BALL_NEXT_DIRECTION[direction]
    )

    if (isLeft) {
      ball.directions = [DIRECTION_UP, DIRECTION_RIGHT]
    } else {
      ball.directions = [DIRECTION_UP, DIRECTION_LEFT]
    }
  }

  console.log({ currentY, BALL_COLLISION_Y_NEGATIVE })
  if (currentY === BALL_COLLISION_Y_NEGATIVE) {
    if (isLeft) {
      ball.directions = [DIRECTION_DOWN, DIRECTION_RIGHT]
    } else {
      ball.directions = [DIRECTION_DOWN, DIRECTION_LEFT]
    }
  }

  ball.directions.forEach((direction) => {
    switch (direction) {
      case DIRECTION_UP: {
        ball.y -= 2
        break
      }
      case DIRECTION_RIGHT: {
        ball.x += 2
        break
      }
      case DIRECTION_DOWN: {
        ball.y += 2
        break
      }
      case DIRECTION_LEFT: {
        ball.x -= 2
        break
      }
      default:
        return
    }
  })
}

function update() {
  drawPlayer()
  drawBall()
  checkCollision()
}

function onClick() {
  button.classList.toggle('hide')
  start()
}

function onKeyDown(e) {
  keyState[e.code] = true
}

function onKeyUp(e) {
  keyState[e.code] = false
}

function restart() {
  button.classList.toggle('hide')
  player = PLAYER_INITIAL_POSITION
  ball.x = BALL_INITIAL_X
  ball.y = BALL_INITIAL_Y
  ball.directions = [DIRECTION_DOWN]
  Object.keys(keyState).forEach((k) => delete keyState[k])

  document.addEventListener('keydown', onKeyDown)

  document.addEventListener('keyup', onKeyUp)

  start()
}

function start() {
  const { x, y } = ball
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.beginPath()
  if ((keyState['KeyD'] || keyState['ArrowRight']) && player < 525) player += 4
  else if ((keyState['KeyA'] || keyState['ArrowLeft']) && player > 0)
    player -= 4

  update()

  if (y < 594) {
    requestId = window.requestAnimationFrame(start)
  } else {
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
    button.removeEventListener('click', onClick)

    button.addEventListener('click', restart)

    button.classList.toggle('hide')

    const strong = document.querySelector('strong')
    if (strong.classList.contains('hide')) {
      strong.classList.remove('hide')
    }

    cancelAnimationFrame(requestId)
  }
}

button.addEventListener('click', onClick)

document.addEventListener('keydown', onKeyDown)

document.addEventListener('keyup', onKeyUp)
