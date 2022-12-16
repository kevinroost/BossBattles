/*-------------------------------- Constants --------------------------------*/

const statObj = {
  maxHP: 0,
  atk: 0,
  spd: 0,
  def: 0,
  crit: 0,
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

const barbarian = new Class(8, 4, 5, 5, 2)
const rogue = new Class(3, 5, 7, 3, 6)
const sorceress = new Class(3, 10, 3, 2, 5)

class Enemy {
  constructor (maxHP, atk, spd, def, crit) {
    this.maxHP = maxHP
    this.atk = atk
    this.spd = spd
    this.def = def
    this.crit = crit
  }
}

const enemy1 = new Enemy (4, 4, 4, 4, 4)
const enemy2 = new Enemy (5, 5, 5, 5, 5)
const enemy3 = new Enemy (6, 6, 6, 6, 6)
const enemy4 = new Enemy (7, 7, 7, 7, 7)
const enemy5 = new Enemy (8, 8, 8, 8, 8)

const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5]


/*---------------------------- Variables (state) ----------------------------*/

let maxHP = document.querySelector('#max-hp')
let atk = document.querySelector('#atk')
let spd = document.querySelector('#spd')
let def = document.querySelector('#def')
let crit = document.querySelector('#crit')

let classChosen
let boardMessage
let battleCount = 1
let turn
let enemy


/*------------------------ Cached Element References ------------------------*/

const barSelect = document.querySelector('#bar')
const rogSelect = document.querySelector('#rog')
const sorSelect = document.querySelector('#sor')
const allClasses = document.querySelector('#classes')
const battleBoardHead = document.querySelector('#board-header')


/*----------------------------- Event Listeners -----------------------------*/


barSelect.addEventListener('click', selectBarb)
rogSelect.addEventListener('click', selectRog)
sorSelect.addEventListener('click', selectSor)



/*-------------------------------- Functions --------------------------------*/

init()

function init() {
  classChosen = false
  for (stat in statObj) {
    statObj[stat] = '?'
  }
  render()
}

function fight() {
  findEnemy()
  battleCount = battleCount + 1
  console.log(enemy);
  checkSpeed()
  //take turns until either HP hits 0
  //anounce winner
  return
}

function render() {
  renderStats()
  renderMessage()
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
  } else {
    battleBoardHead.textContent = `Round ${battleCount}/5`
  }
}

function findEnemy() {
  enemy = enemies[battleCount - 1]
}

function checkSpeed() {
  if (statObj.spd >= enemy.spd) {
    turn = -1
  } else turn = 1
}

function selectBarb () {
  classChosen = true
  for (stat in statObj) {
    statObj[stat] = barbarian[stat]
  }
  console.log(statObj);
  render()
  fight()
}

function selectRog () {
  classChosen = true
  for (stat in statObj) {
    statObj[stat] = rogue[stat]
  }
  console.log(statObj);
  render()
  fight()
}

function selectSor () {
  classChosen = true
  for (stat in statObj) {
    statObj[stat] = sorceress[stat]
  }
  console.log(statObj);
  render()
  fight()
}

function pickUpItem () {
  updateStat(maxHP, 3)
}

function updateStat(stat, inc) {
  stat.textContent = parseInt(stat.textContent) + inc
}
