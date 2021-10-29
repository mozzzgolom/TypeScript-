import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import { renderToast } from './lib.js'

const date = new Date()
const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
const nextDateDay = nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate()
const nextDateMonth = nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1
const nextDateYear = nextDate.getFullYear() + ''
const nextDay = `${nextDateYear}-${nextDateMonth}-${nextDateDay}`
const secondDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3);
const secondDateDay = secondDate.getDate() < 10 ? '0' + secondDate.getDate() : secondDate.getDate();
const secondDateMonth = secondDate.getMonth() + 1 < 10 ? '0' + (secondDate.getMonth() + 1) : secondDate.getMonth() + 1;
const secondDateYear = secondDate.getFullYear() + '';
const secondDay = `${secondDateYear}-${secondDateMonth}-${secondDateDay}`;

let userData: unknown
let favoritesAmount: unknown
interface UserData {
  username: string,
  avatarURL: string
}

const getUserData = () => {
  localStorage.setItem('user', JSON.stringify({ username: 'name lastname', avatarURL: '/img/avatar.png' }))
  return userData = JSON.parse(localStorage.getItem('user')) as UserData
}

const validateData = (data: any): UserData => {
  console.log(data, data.username, data.avatarURL, typeof data, typeof data === 'object', 'username' in data, 'avatarURL' in data)
  if (typeof data === 'object' && 'username' in data && 'avatarURL' in data) {
    console.log(data)
    return data
  }
}

const getFavoritesAmount = () => {
  localStorage.setItem('favoritesAmount', '5')
  return localStorage.getItem('favoritesAmount')
}

getUserData()

window.addEventListener('DOMContentLoaded', () => {
  const data = validateData(userData)
  favoritesAmount = Number(getFavoritesAmount())
  if (typeof favoritesAmount === 'number') {
    renderUserBlock(data.username, data.avatarURL, favoritesAmount)
  }
  renderSearchFormBlock(nextDay, secondDay)
  renderSearchStubBlock()
  renderToast(
    { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
    { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  )
})
