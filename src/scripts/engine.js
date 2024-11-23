const state = {
  view: {
    squares: document.querySelectorAll('.square'),
    enemy: document.querySelector('.enemy'),
    timeleft: document.querySelector('#time-left'),
    score: document.querySelector('#score'),
    lives: document.querySelector('#lives'),
    restartButton: document.querySelector('#restart')
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    bestScore: 0,
    currentTime: 30,
    lives: 3
  },
  actions: {
    timerId: setInterval(randomSquare, 1000),
    countDownTimerId: setInterval(countDown, 1000)
  }
}

function countDown() {
  state.values.currentTime--
  state.view.timeleft.textContent = state.values.currentTime

  if (state.values.currentTime <= 0) {
    if (state.values.result > state.values.bestScore) {
      state.values.bestScore = state.values.result // Guarda o maior placar
      alert('Fim de rodada! Sua pontuação foi: ' + state.values.result)
    }

    state.values.result = 0 // Zera o placar atual
    state.view.score.textContent = state.values.result // Atualiza o marcador de placar no HTML

    state.values.lives--
    state.view.lives.textContent = 'x' + state.values.lives // Atualiza o marcador de vidas no HTML

    if (state.values.lives > 0) {
      state.values.currentTime = 30
    } else {
      clearInterval(state.actions.countDownTimerId)
      clearInterval(state.actions.timerId)
      alert(
        'Game Over! Sua melhor pontuação em todas as rodadas foi: ' +
          state.values.bestScore
      )
      playSound('videogame-death-sound')
    }
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.mp3`)
  audio.volume = 0.2
  audio.play()
}

function randomSquare() {
  state.view.squares.forEach(square => {
    square.classList.remove('enemy')
  })

  let randomNumber = Math.floor(Math.random() * 9)
  let randomSquare = state.view.squares[randomNumber]
  randomSquare.classList.add('enemy')
  state.values.hitPosition = randomSquare.id
}

// Aqui era a demonstração do move enemy, em forma de função, que ele alterou direto para o state.actions
// function moveEnemy() {
//   state.values.timerId = setInterval(randomSquare, state.values.gameVelocity)
// }

function addListenerHitbox() {
  state.view.squares.forEach(square => {
    square.addEventListener('mousedown', () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++
        state.view.score.textContent = state.values.result
        state.values.hitPosition = null
        playSound('retro-coin')
      }
    })
  })
}

function restartGame() {
  // Limpa os temporizadores antigos
  clearInterval(state.actions.timerId)
  clearInterval(state.actions.countDownTimerId)

  // Reinicia os valores do jogo
  state.values.result = 0
  state.values.currentTime = 30
  state.values.lives = 3
  state.values.bestScore = 0

  // Atualiza os elementos visuais
  state.view.score.textContent = state.values.result
  state.view.timeleft.textContent = state.values.currentTime
  state.view.lives.textContent = state.values.lives

  // Reinicia os temporizadores
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity)
  state.actions.countDownTimerId = setInterval(countDown, 1000)
  playSound('3-sound-menu-button')
}

function initialize() {
  // moveEnemy() - Aqui dava o start no movimento do inimigo, mas foi alterado para state.actions
  addListenerHitbox()
  state.view.restartButton.addEventListener('click', restartGame)
}

initialize()
