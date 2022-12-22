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



const enemy1 = new Enemy ('IMP', 40, 4, 4, 3, 1)
const enemy2 = new Enemy ('LIZARD MAN', 50, 5, 5, 4, 2)
const enemy3 = new Enemy ('OGRE', 60, 6, 6, 5, 3)
const enemy4 = new Enemy ('LEVIATHAN', 70, 7, 7, 6, 3)
const enemy5 = new Enemy ('DRAGON', 80, 8, 8, 7, 4)

const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5]

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





/*------------------------ Cached Element References ------------------------*/

const allClasses = document.querySelector('#classes')
const battleBoardHead = document.querySelector('#board-header')
const footer = document.querySelector('footer')
const prizes = document.querySelector('#prizes')
const equippedList = document.querySelector('#item-list')
const enemyDmgFlash = document.querySelector('#enemy-dmg')
const playerDmgFlash = document.querySelector('#player-dmg')
const dmgFlash = document.querySelector('.dmg-flash')

const pendingPrizes = []


/*----------------------------- Event Listeners -----------------------------*/

allClasses.addEventListener('click', selectChar)
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
  for (statKey in statObj) {
    statObj.statKey = null
  } 
  document.getElementById('characters').style.visibility = 'hidden'
  console.log(equippedList.textContent);
  document.getElementsByClassName('character').innerHTML = null
  for (stat in statObj) {
    statObj[stat] = '?'
  }
  equippedItems.forEach (item => {
    possiblePrizes.push(equippedItems.splice(equippedItems.indexOf(item), 1)[0])
  })
  enableClassButtons()
  render()
  renderEquippedItems()
  console.log(possiblePrizes);
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
  // renderEquippedItems()
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
  if (isCrit) {
    charFlash.textContent = '-' + dmg
    charFlash.style.backgroundColor = 'red'
  } else {
    charFlash.style.backgroundColor = null
    charFlash.textContent = '-' + dmg
  }
  // console.log('hunter yayyyyy');
  // charFlash.classList.add('dmg-flash-out')
  // setTimeout(() => charFlash.classList.add('dmg-flash-in'), 2000)
  // setTimeout(() => charFlash.classList.remove('dmg-flash-out'), 2000)


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
  console.log(document.getElementsByClassName('dmg-dealt').textContent);
  return Math.round(damage)
}

function renderPrizes() {
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  pendingPrizes.push(possiblePrizes.splice([Math.floor(Math.random() * possiblePrizes.length)], 1)[0])
  document.getElementById('prizes').innerHTML = `<p class="loot-option" id="0"></p><p class="loot-option" id="1"></p><p class="loot-option" id="2"></p>`
  for (let i = 0; i < 3; i++) {
    id = `${i}`
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
  console.log(prizeIndex);
  for (let i = pendingPrizes.length - 1; i >=0 ; i--) {
    if (i != prizeIndex) {
      possiblePrizes.push(pendingPrizes.splice(i, 1)[0])
    } else equippedItems.push(pendingPrizes.splice(i, 1)[0])
  }
  winner = false
  renderEquippedItems()
  initFight()
  prizes.innerHTML = null
  // prizes.style.visibility = 'hidden'
}

function renderEquippedItems() {
  console.log(equippedItems.length);
  equippedList.innerHTML = null
  equippedItems.forEach(item => {
    if (!(item.stat2)) {
      equippedList.append(`${item.name}, ${item.stat}+${item.increment}`, document.createElement('p'))
    } else if (item.stat2) {
      equippedList.append(`${item.name}, ${item.stat}+${item.increment} ${item.stat2}+${item.increment2}`, document.createElement('p'))
    }
  })
}

function updateStat(stat, inc, stat2, inc2) {
  statObj[stat] = statObj[stat] + inc
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

function enableClassButtons() {
  allClasses.addEventListener('click', selectChar)
  allClasses.style.color = 'black'
  for (let i = 0; i < document.getElementsByClassName("class").length; i++) {
    document.getElementsByClassName("class")[i].style.border = '3px solid black'
    document.getElementsByClassName("class")[i].style.cursor = 'pointer'
  }
}

function gameEnd() {
  if (playerCurrentHP > 0) {
    battleBoardHead.textContent = `VICTORY`
  } else {
    battleBoardHead.textContent = `DEFEAT. TRY AGAIN!`
  }
  turn = null
  renderTurnMessage()
  document.getElementById('atk-btn').style.visibility = 'hidden'
}