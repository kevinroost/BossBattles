/*-------------------------------- Constants --------------------------------*/




/*---------------------------- Variables (state) ----------------------------*/

let maxHP = document.querySelector('#max-hp')
let atk = document.querySelector('#atk').textContent
let spd = document.querySelector('#spd').textContent
let dfs = document.querySelector('#dfs').textContent
let crit = document.querySelector('#crit').textContent




/*------------------------ Cached Element References ------------------------*/

const bar = document.querySelector('#bar')
const rog = document.querySelector('#rog')
const sor = document.querySelector('#sor')




/*----------------------------- Event Listeners -----------------------------*/

bar.addEventListener('click', selectBarb)
// rog.addEventListener('click', selectRog)
// sor.addEventListener('click', selectSor)



/*-------------------------------- Functions --------------------------------*/

function selectBarb () {
  maxHP.textContent = 5
  atk = 5
  spd = 3
  def = 6
  crit = 2
}
