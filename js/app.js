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



/*---------------------------- Variables (state) ----------------------------*/

let maxHP = document.querySelector('#max-hp')
let atk = document.querySelector('#atk')
let spd = document.querySelector('#spd')
let def = document.querySelector('#def')
let crit = document.querySelector('#crit')

let classChosen
let boardMessage
let battleCount = 0


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

function selectBarb () {
  classChosen = true
  for (stat in statObj) {
    statObj[stat] = barbarian[stat]
  }
  console.log(statObj);
  render()
}

function selectRog () {
  classChosen = true
  for (stat in statObj) {
    statObj[stat] = rogue[stat]
  }
  console.log(statObj);
  render()
}

function selectSor () {
  classChosen = true
  for (stat in statObj) {
    statObj[stat] = sorceress[stat]
  }
  console.log(statObj);
  render()
}

function pickUpItem () {
  updateStat(maxHP, 3)
}

function updateStat(stat, inc) {
  stat.textContent = parseInt(stat.textContent) + inc
}
