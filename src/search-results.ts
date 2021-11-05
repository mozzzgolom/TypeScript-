import { renderBlock } from './lib.js'
import { getFavoritesAmount, validateData, getUserData } from './index.js'
import { renderUserBlock } from './user.js';


export function renderSearchStubBlock() {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock(reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

interface IPlace {
  id: number,
  name: string,
  description: string,
  image: string,
  remoteness: number,
  bookedDates: [],
  price: number
}

let currentPLace: IPlace
let favoriteList = JSON.parse(localStorage.getItem('favoritesAmount'))

export function renderSearchResultsBlock(place: IPlace) {
  console.log('renderSearchResultsBlock: ', place)
  currentPLace = place
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      <li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div class="favorites" data-index="1"></div>
            <img class="result-img" src="./img/result-1.png" alt="">
          </div>	
          <div class="result-info">
            <div class="result-info--header">
              <p>YARD Residence Apart-hotel</p>
              <p class="price">13000&#8381;</p>
            </div>
            <div class="result-info--map"><i class="map-icon"></i> 2.5км от вас</div>
            <div class="result-info--descr">Комфортный апарт-отель в самом сердце Санкт-Петербрга. К услугам гостей номера с видом на город и бесплатный Wi-Fi.</div>
            <div class="result-info--footer">
              <div>
                <button>Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div class="favorites" data-index="2"></div>
            <img class="result-img" src="./img/result-2.png" alt="">
          </div>	
          <div class="result-info">
            <div class="result-info--header">
              <p>Akyan St.Petersburg</p>
              <p class="price">13000&#8381;</p>
            </div>
            <div class="result-info--map"><i class="map-icon"></i> 1.1км от вас</div>
            <div class="result-info--descr">Отель Akyan St-Petersburg с бесплатным Wi-Fi на всей территории расположен в историческом здании Санкт-Петербурга.</div>
            <div class="result-info--footer">
              <div>
                <button>Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    `
  )

  const resultsList: HTMLElement = document.querySelector('.results-list')
  const favoritesElem: NodeList = document.querySelectorAll('.favorites')

  toggleFavoritesElem(favoritesElem)

  console.log(resultsList)
  resultsList.addEventListener('click', (evt) => {
    console.log('click')
    const target = evt.target as HTMLElement
    const classList = target.classList
    //console.log(classList)
    for (const val of classList) {
      console.log(val)
      if (val === 'favorites') {
        const idx = Number(target.dataset.index)
        console.log(idx)
        toggleFavoriteItem(idx, favoritesElem)

        break
      } else {
        console.log(JSON.parse(localStorage.getItem('favoritesAmount')))
      }
    }
  })
}




let favoritesAmount: unknown
let userData: unknown
const toggleFavoritesElem = (favoritesElem: NodeList) => {
  for (let i = 0; i < favoritesElem.length; i++) {
    const elem = favoritesElem[i] as HTMLElement
    if (Number(elem.dataset.index) in favoriteList) {
      elem.classList.add('active')
    } else {
      elem.classList.remove('active')
    }
  }

}

const toggleFavoriteItem = (idx: number, favoritesElem: NodeList) => {
  if (idx in favoriteList) {
    console.log(idx in favoriteList)
    delete favoriteList[idx]
    toggleFavoritesElem(favoritesElem)
  } else {
    favoriteList = {
      [idx]: currentPLace[idx],
      ...favoriteList
    }
    toggleFavoritesElem(favoritesElem)
  }

  localStorage.setItem('favoritesAmount', JSON.stringify(favoriteList))
  userData = getUserData()
  const data = validateData(userData)
  favoritesAmount = Number(getFavoritesAmount())
  if (typeof favoritesAmount === 'number') {
    renderUserBlock(data.username, data.avatarURL, favoritesAmount)
  }
}