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

const barbarian = new Class(60, 7, 5, 7, 2)
const rogue = new Class(30, 5, 7, 3, 9)
const sorceress = new Class(30, 13, 3, 2, 5)

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

const enemies = [
  new Enemy ('IMP', 40, 4, 4, 3, 1),
  new Enemy ('LIZARD MAN', 50, 5, 5, 4, 2),
  new Enemy ('OGRE', 60, 6, 6, 5, 3),
  new Enemy ('LEVIATHAN', 70, 7, 7, 6, 3),
  new Enemy ('DRAGON', 80, 8, 8, 7, 4),
]


class Prize {
  constructor (name, stat, increment, stat2, increment2) {
    this.name = name
    this.stat = stat
    this.increment = increment
    this.stat2 = stat2
    this.increment2 = increment2
  }
}

const equippedItems = []
const possiblePrizes = [
  new Prize ('Whetstone', 'atk', 3),
  new Prize ('Small Shield', 'def', 3),
  new Prize ('Light Boots', 'def', 2),
  new Prize ('Glasses', 'crit', 2),
  new Prize ('Adrenaline', 'spd', 2),
  new Prize ('Grip', 'atk', 2),
  new Prize ('Go Go Go!', 'spd', 3),
  new Prize ('Ninja Star', 'atk', 2),
  new Prize ('Spud Launcher', 'atk', 1),
  new Prize ('Hollow Points', 'atk', 2),
  new Prize ('Spiked Shield', 'def', 2, 'atk', 1),
  new Prize ('Steroids', 'atk', 2, 'maxHP', 15),
  new Prize ('Potion', 'maxHP', 30),
  new Prize ('Extra Rations', 'maxHP', 20),
  new Prize ('Four Leaf Clover', 'crit', 2),
  new Prize ('Unicorn Horn', 'crit', 3),
  new Prize ('Kevlar', 'def', 3),
  new Prize ('Mithril Shirt', 'def', 3),
  new Prize ('Ferrari', 'spd', 4),
  new Prize ('Roller Blade Attachment', 'spd', 3)
]

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
let cancel = true





/*------------------------ Cached Element References ------------------------*/

// const allClasses = document.querySelector('#classes')
const eachClass = document.querySelectorAll('.class')
const battleBoardHead = document.querySelector('#board-header')
const footer = document.querySelector('footer')
const prizes = document.querySelector('#prizes')
const equippedList = document.querySelector('#item-list')
const enemyDmgFlash = document.querySelector('#enemy-dmg')
const playerDmgFlash = document.querySelector('#player-dmg')
const dmgFlash = document.querySelector('.dmg-flash')
const statsAndItems = document.querySelectorAll('.list')

const pendingPrizes = []


/*----------------------------- Event Listeners -----------------------------*/

prizes.addEventListener('click', handlePrizeClick)
document.getElementById('reset-btn').addEventListener('click', init)


/*-------------------------------- Functions --------------------------------*/

init()

function init() {
  classChosen = false
  battleCount = 0
  turn = null
  winner = false
  currentClass = null
  prizes.innerHTML = null
  cancel = true
  for (statKey in statObj) {
    statObj.statKey = null
  } 
  document.getElementById('characters').style.visibility = 'hidden'
  for (stat in statObj) {
    statObj[stat] = '?'
  }  
  while (equippedItems.length > 0) {
    possiblePrizes.push(equippedItems.splice(0, 1)[0])
  }
  enableClassButtons()
  render()
  renderEquippedItems()
  document.body.style.backgroundImage = 'linear-gradient(black 5%, darkgreen 30%, green 70%, lightgreen 90%)'
  document.body.style.backgroundPosition = 'center';
  document.querySelector('.pyro').style.visibility = 'hidden'
}

function render() {
  if (battleCount === 5 && winner) {
    gameEnd()
    return
  }
  renderStats()
  renderMessage()
  if (classChosen) renderCharacters()
  renderTurnMessage()
}

function initFight() {
  cancel = false
  findEnemy()
  playerCurrentHP = statObj.maxHP
  battleCount = battleCount + 1
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
  if (winner && battleCount < 5) {
    renderPrizes()
    return
  } else if (winner && battleCount === 5) {
    gameEnd()
    return
  }
  setTimeout(() => enemyTurn(), 1000)
}

function playerTurn() {
  let damage = calculateDamage(statObj.atk, enemy.def, statObj.crit)
  enemyCurrentHP -= damage
  damageFlash(enemyDmgFlash, damage)
  if (enemyCurrentHP <= 0) {
    winner = true
    turn = 0
  }
  turn *= -1
  render()
}

function enemyTurn() {
  if (cancel) return
  let damage = calculateDamage(enemy.atk, statObj.def, enemy.crit)
  playerCurrentHP -= damage
  damageFlash(playerDmgFlash, damage)
  if (playerCurrentHP <= 0) {
    winner = true
    turn = 0
  }
  turn *= -1
  render()
}

function damageFlash(charFlash, dmg) {
  cancel = false
  if (isCrit) {
    charFlash.textContent = '-' + dmg
    charFlash.style.backgroundColor = 'red'
  } else {
    charFlash.style.backgroundColor = null
    charFlash.textContent = '-' + dmg
  }
  let cls = ['dmg-flash-out','dmg-flash-in']
  charFlash.classList.remove(...cls)
  charFlash.offsetHeight
  charFlash.classList.add('dmg-flash-out')
  charFlash.classList.add('dmg-flash-in')
}

function calculateDamage(atk, opposingDef, crit) {
  let damage = atk
  let critRoll = Math.floor(Math.random() * 21)
  isCrit = critRoll <= crit ? true : false
  if (isCrit) damage *= 2
  damage *= (1 - (opposingDef * .05))
  document.getElementsByClassName('dmg-dealt').textContent = damage
  return Math.round(damage)
}

function renderPrizes() {
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  document.getElementById('prizes').innerHTML = `<p class="loot-option" id="0"></p><p class="loot-option" id="1"></p><p class="loot-option" id="2"></p>`
  for (let i = 0; i < 3; i++) {
    id = i
    if (!(pendingPrizes[i].stat2)) {
      document.getElementById(id).innerHTML = pendingPrizes[i].name + '<br>' + pendingPrizes[i].stat + ' +' + pendingPrizes[i].increment
    } else if (pendingPrizes[i].stat2) {
      document.getElementById(id).innerHTML = pendingPrizes[i].name + '<br>' + pendingPrizes[i].stat + " +" + pendingPrizes[i].increment + " " + pendingPrizes[i].stat2 + ' +' + pendingPrizes[i].increment2
    }
  }
  document.getElementById('player-hud').style.borderRight = 'none'
  document.getElementById('characters').style.visibility = 'hidden'
}

function handlePrizeClick(evt) {
  if (evt.target.className != 'loot-option') return
  let prizeIndex = evt.target.id
  updateStat(pendingPrizes[prizeIndex].stat, pendingPrizes[prizeIndex].increment, pendingPrizes[prizeIndex].stat2, pendingPrizes[prizeIndex].increment2)
  for (let i = pendingPrizes.length - 1; i >=0 ; i--) {
    if (i != prizeIndex) {
      possiblePrizes.push(pendingPrizes.splice(i, 1)[0])
    } else equippedItems.push(pendingPrizes.splice(i, 1)[0])
  }
  winner = false
  renderEquippedItems()
  initFight()
  prizes.innerHTML = null
}

function updateStat(stat, inc, stat2, inc2) {
  statObj[stat] = statObj[stat] + inc
  statObj[stat2] = statObj[stat2] + inc2

}

function renderEquippedItems() {
  equippedList.innerHTML = null
  if (equippedItems.length === 0) equippedList.textContent = 'EMPTY'
  equippedItems.forEach(item => {
    if (!(item.stat2)) {
      equippedList.append(`${item.name}, ${item.stat}+${item.increment}`, document.createElement('p'))
    } else if (item.stat2) {
      equippedList.append(`${item.name}, ${item.stat}+${item.increment} ${item.stat2}+${item.increment2}`, document.createElement('p'))
    }
  })
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
    gameEnd()
    turn = null
  } else if (winner && enemyCurrentHP <= 0) {
    battleBoardHead.textContent = 'You Win!'
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
  disableClassButtons()
  initFight()
}

function disableClassButtons() {
  eachClass.forEach(button => {button.removeEventListener('click', selectChar)})
  eachClass.forEach(i => {i.classList.add('disabled')})
  eachClass.forEach(i => {i.classList.remove('enabled')})
  statsAndItems.forEach(i => {i.classList.remove('disabled')})
  statsAndItems.forEach(i => {i.classList.add('enabled')})
}

function enableClassButtons() {
  eachClass.forEach(button => {button.addEventListener('click', selectChar)})
  eachClass.forEach(i => {i.classList.remove('disabled')})
  eachClass.forEach(i => {i.classList.add('enabled')})
  statsAndItems.forEach(i => {i.classList.add('disabled')})
  statsAndItems.forEach(i => {i.classList.remove('enabled')})
}

function gameEnd() {
  if (playerCurrentHP > 0) {
    battleBoardHead.textContent = `VICTORY`
    document.body.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet, red)'
    document.querySelector('.pyro').style.visibility = 'visible'
  } else {
    battleBoardHead.textContent = `DEFEAT. TRY AGAIN!`
    
  }
  turn = null
  renderTurnMessage()
  renderCharacters()
  document.getElementById('atk-btn').style.visibility = 'hidden'
  console.log('end');
}