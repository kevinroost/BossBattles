/*-------------------------------- Constants --------------------------------*/

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




/*------------------------ Cached Element References ------------------------*/

const barSelect = document.querySelector('#bar')
const rogSelect = document.querySelector('#rog')
const sorSelect = document.querySelector('#sor')




/*----------------------------- Event Listeners -----------------------------*/

barSelect.addEventListener('click', selectBarb)
rogSelect.addEventListener('click', selectRog)
sorSelect.addEventListener('click', selectSor)



/*-------------------------------- Functions --------------------------------*/

function selectBarb () {
  maxHP.textContent = barbarian.maxHP
  atk.textContent = barbarian.atk
  spd.textContent = barbarian.spd
  def.textContent = barbarian.def
  crit.textContent = barbarian.crit
}

function selectRog () {
  maxHP.textContent = rogue.maxHP
  atk.textContent = rogue.atk
  spd.textContent = rogue.spd
  def.textContent = rogue.def
  crit.textContent = rogue.crit
}

function selectSor () {
  maxHP.textContent = sorceress.maxHP
  atk.textContent = sorceress.atk
  spd.textContent = sorceress.spd
  def.textContent = sorceress.def
  crit.textContent = sorceress.crit
}

function pickUpItem () {
  maxHP.textContent ++
}

