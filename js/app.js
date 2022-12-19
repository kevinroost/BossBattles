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
  constructor (maxHP, atk, spd, def, crit) {
    this.maxHP = maxHP
    this.atk = atk
    this.spd = spd
    this.def = def
    this.crit = crit
  }
}

const enemy1 = new Enemy (40, 4, 4, 3, 1)
const enemy2 = new Enemy (50, 5, 5, 4, 2)
const enemy3 = new Enemy (60, 6, 6, 5, 3)
const enemy4 = new Enemy (70, 7, 7, 6, 3)
const enemy5 = new Enemy (80, 8, 8, 7, 4)

const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5]


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


/*------------------------ Cached Element References ------------------------*/

const barSelect = document.querySelector('#bar')
const rogSelect = document.querySelector('#rog')
const sorSelect = document.querySelector('#sor')
const allClasses = document.querySelector('#classes')
const battleBoardHead = document.querySelector('#board-header')
const footer = document.querySelector('footer')


/*----------------------------- Event Listeners -----------------------------*/


// barSelect.addEventListener('click', selectChar)
// rogSelect.addEventListener('click', selectChar)
// sorSelect.addEventListener('click', selectChar)

allClasses.addEventListener('click', selectChar)



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
  renderTurnMessage()
  if (classChosen) renderCharacters()
}

function initFight() {
  findEnemy()
  battleCount = battleCount + 1
  console.log(enemy);
  checkSpeed()
  render()
}

function renderTurnMessage() {
  if (turn === -1) {
    footer.textContent = `It's your turn!`
  } else if (turn === 1) {
    footer.textContent = `It's the monster's turn.`
  } else if (turn === 0) {
    footer.textContent = `Choose your prize!`
  } else if (turn === null) footer.textContent = null
}

function handleAtkClick () {
  //apply damage
  //check for winner
  //if no winner, switch turn
  //repeat above until hp <= 
  //if winner, 
    //announce winner
    //turn = 0 and 
    //return prize options
}

function handlePrizeClick() {
  //boost applicable stats
  //update inventory
  //initFight
}
// FUNCTION HANDLE CLICK 
// FUNCTION RENDER CHARACTERS

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
  } else {
    battleBoardHead.textContent = `Round ${battleCount}/5`
  }
}

function findEnemy() {
  enemy = enemies[battleCount]
}

function checkSpeed() {
  if (statObj.spd >= enemy.spd) {
    turn = -1
  } else if (statObj.spd < enemy.spd) {
    turn = 1
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
      break
    case 'rog':
      for (stat in statObj) {
        statObj[stat] = rogue[stat]
      }
      break
    case 'sor':
      for (stat in statObj) {
        statObj[stat] = sorceress[stat]
      }
      break
  }
  allClasses.removeEventListener('click', selectChar)
  console.log(statObj);
  initFight()
}

function pickUpItem () {
  updateStat(maxHP, 3)
}

function updateStat(stat, inc) {
  stat.textContent = parseInt(stat.textContent) + inc
}
