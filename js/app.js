/*-------------------------------- Constants --------------------------------*/

const statObj = {
  maxHP: null,
  atk: null,
  spd: null,
  def: null,
  crit: null,
}

class Class {
  constructor (maxHP, atk, spd, def, crit) {
    this.maxHP = maxHP
    this.atk = atk
    this.spd = spd
    this.def = def
    this.crit = crit
  }
}

const barbarian = new Class(80, 4, 5, 5, 2)
const rogue = new Class(30, 5, 7, 3, 6)
const sorceress = new Class(30, 10, 3, 2, 5)

class Enemy {
  constructor (name, maxHP, atk, spd, def, crit) {
    this.name = name
    this.maxHP = maxHP
    this.atk = atk
    this.spd = spd
    this.def = def
    this.crit = crit
  }
}

const enemy1 = new Enemy ('enemy1', 40, 4, 4, 3, 1)
const enemy2 = new Enemy ('enemy2', 50, 5, 5, 4, 2)
const enemy3 = new Enemy ('enemy3', 60, 6, 6, 5, 3)
const enemy4 = new Enemy ('enemy4', 70, 7, 7, 6, 3)
const enemy5 = new Enemy ('enemy5', 80, 8, 8, 7, 4)

const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5]

class Prize {
  constructor (name, stat, increment) {
    this.name = name
    this.stat = stat
    this.increment = increment
  }
}

const possiblePrizes = []

const prize1 = new Prize ('Whetstone', 'atk', 3)
const prize2 = new Prize ('Small Shield', 'def', 3)
const prize3 = new Prize ('Light Boots', 'def', 2)
const prize4 = new Prize ('Glasses', 'crit', 2)
const prize5 = new Prize ('Adrenaline', 'spd', 2)
const prize6 = new Prize ('Grip', 'atk', 2)
const prize7 = new Prize ('Go Go Go!', 'spd', 3)
possiblePrizes.push(prize1, prize2, prize3, prize4, prize5, prize6, prize7)

/*---------------------------- Variables (state) ----------------------------*/

let maxHP = document.querySelector('#max-hp')
let atk = document.querySelector('#atk')
let spd = document.querySelector('#spd')
let def = document.querySelector('#def')
let crit = document.querySelector('#crit')

let classChosen
let boardMessage
let battleCount = 0
let turn = null
let enemy
let currentClass
let playerCurrentHP
let enemyCurrentHP
let winner = false
let isCrit



/*------------------------ Cached Element References ------------------------*/

const allClasses = document.querySelector('#classes')
const battleBoardHead = document.querySelector('#board-header')
const footer = document.querySelector('footer')
const prizes = document.querySelector('#prizes')

const pendingPrizes = []


/*----------------------------- Event Listeners -----------------------------*/

allClasses.addEventListener('click', selectChar)
prizes.addEventListener('click', handlePrizeClick)


/*-------------------------------- Functions --------------------------------*/

init()

function init() {
  classChosen = false
  for (stat in statObj) {
    statObj[stat] = '?'
  }
  render()
}

function render() {
  renderStats()
  renderMessage()
  if (classChosen) renderCharacters()
  renderTurnMessage()
}

function initFight() {
  findEnemy()
  playerCurrentHP = statObj.maxHP
  battleCount = battleCount + 1
  console.log(enemy);
  checkSpeed()
  render()
}

function renderTurnMessage() {
  switch(turn) {
    case -1:
      footer.textContent = `It's your turn!`
      document.querySelector('#atk-btn').addEventListener('click', handleAtkClick)
      break
    case 1:
      footer.textContent = `It's the monster's turn.`
      document.querySelector('#atk-btn').removeEventListener('click', handleAtkClick)
      break
    case 0:
      footer.textContent = `Choose your prize!`
      break
    case null:
      footer.textContent = null
      break
  }
}
  
function handleAtkClick () {
  playerTurn()
  if (winner) {
    renderPrizes()
    console.log(prizes);
    return
  }
  setTimeout(() => enemyTurn(), 0)
  //repeat above until hp <= 
  //if winner, 
  //announce winner
  //turn = 0 and 
  //return prize options
}

function playerTurn() {
  let critRoll = Math.floor(Math.random() * 21)
  isCrit = critRoll <= statObj.crit ? true : false
  enemyCurrentHP = isCrit ? enemyCurrentHP - (statObj.atk * 2) : enemyCurrentHP - statObj.atk
  if (enemyCurrentHP <= 0) {
    winner = true
    turn = 0
  }
  turn *= -1
  render()
}

function renderPrizes() {
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  console.log(pendingPrizes);
  document.getElementById('prizes').innerHTML = `<p class="loot-option" id="prize0"></p><p class="loot-option" id="prize1"></p><p class="loot-option" id="prize2"></p>`
  for (let i = 0; i < 3; i++) {
    id = `prize${i}`
    document.getElementById(id).innerHTML = pendingPrizes[i].name + '<br>' + pendingPrizes[i].stat + " +" + pendingPrizes[i].increment
  }
  document.getElementById('player-hud').style.borderRight = 'none'
  document.getElementById('characters').style.visibility = 'hidden'
}

function handlePrizeClick(evt) {
  if (evt.target.className != 'loot-option') return
  let prizeIndex = evt.target.id.slice(-1)
  updateStat(pendingPrizes[prizeIndex].stat, pendingPrizes[prizeIndex].increment, prizeIndex)
  console.log(prizeIndex);
  for (let i = pendingPrizes.length - 1; i >=0 ; i--) {
    if (i != prizeIndex) {
      possiblePrizes.push(pendingPrizes.splice(i, 1)[0])
    } else pendingPrizes.splice(i, 1)
    console.log(possiblePrizes);
  }
  winner = false
  initFight()
  prizes.innerHTML = null
  //boost applicable stats
  //update inventory
  //initFight
}

function updateStat(stat, inc) {
  statObj[stat] = statObj[stat] + inc
}

function enemyTurn() {
  let critRoll = Math.floor(Math.random() * 21)
  isCrit = critRoll <= enemy.crit ? true : false
  playerCurrentHP = isCrit ? playerCurrentHP - (enemy.atk * 2) : playerCurrentHP - enemy.atk
  console.log(isCrit);
  if (playerCurrentHP <= 0) {
    winner = true
    turn = 0
  }
  turn *= -1
  render()
}


function renderCharacters () {
  document.getElementById('player-hud').innerHTML = 
    `<h2 id="current-class"></h2>
    <p class ="current-HP" id="player-HP"></p>
    <button id="atk-btn">ATTACK!</button>`
  document.getElementById('current-class').textContent = currentClass
  document.getElementById('player-HP').textContent = playerCurrentHP
  document.getElementById('computer-hud').innerHTML = 
  `<h2 id="enemy-name"></h2>
  <p class="current-HP" id="enemy-HP"></p>`
  document.getElementById('enemy-name').textContent = enemy.name
  document.getElementById('enemy-HP').textContent = enemyCurrentHP
  document.getElementById('characters').style.visibility = 'visible'
  document.getElementById('player-hud').style.borderRight = '1px solid black'
}

function renderStats() {
  maxHP.textContent = statObj.maxHP
  atk.textContent = statObj.atk
  spd.textContent = statObj.spd
  def.textContent = statObj.def
  crit.textContent = statObj.crit
}

function renderMessage() {
  if (classChosen === false) {
    battleBoardHead.textContent = 'Choose a Class'
  } else if (battleCount === 5) {
    battleBoardHead.textContent = `FINAL BATTLE`
  } else if (winner && playerCurrentHP <= 0) {
    battleBoardHead.textContent = `DEFEAT. TRY AGAIN?`
    turn = null
  } else if (winner && enemyCurrentHP <= 0) {
    battleBoardHead.textContent = 'VICTORY'
  } else {
    battleBoardHead.textContent = `Round ${battleCount}/5`
  }
}

function findEnemy() {
  enemy = enemies[battleCount]
  enemyCurrentHP = enemy.maxHP
}

function checkSpeed() {
  if (statObj.spd >= enemy.spd) {
    turn = -1
  } else if (statObj.spd < enemy.spd) {
    turn = 1
    setTimeout(() => enemyTurn(), 1000)
  } 
}

function selectChar(evt) {
  if (evt.target.className != 'class') return
  classChosen = true
  switch(evt.target.id) {
    case 'bar':
      for (stat in statObj) {
        statObj[stat] = barbarian[stat]
      }
      currentClass = `BARBARIAN`
      break
    case 'rog':
      for (stat in statObj) {
        statObj[stat] = rogue[stat]
      }
      currentClass = `ROGUE`
      break
    case 'sor':
      for (stat in statObj) {
        statObj[stat] = sorceress[stat]
      }
      currentClass = `SORCERESS`
      break
  }
  playerCurrentHP = statObj.maxHP
  console.log(statObj);
  disableClassButtons()
  initFight()
}

function disableClassButtons() {
  allClasses.removeEventListener('click', selectChar)
  allClasses.style.color = 'gray'
  for (let i = 0; i < document.getElementsByClassName("class").length; i++) {
    document.getElementsByClassName("class")[i].style.border = '3px solid gray'
    document.getElementsByClassName("class")[i].style.cursor = 'default'
  }
}

