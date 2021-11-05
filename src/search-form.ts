import { renderBlock } from './lib.js'
import { renderSearchResultsBlock } from './search-results.js';
import { FlatRentSdk } from './flat-rent-sdk.js'

export function renderSearchFormBlock(arrivalDate: string, departureDate: string) {
  const date = new Date()
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const year = date.getFullYear() + ''
  const minDate = `${year}-${month}-${day}`
  let maxDate: string

  if (month !== '12') {
    const nextMonth = date.getMonth() + 2 < 10 ? '0' + (date.getMonth() + 2) : (date.getMonth() + 2) + ''
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate() + ''
    console.log(lastDay)
    maxDate = `${year}-${nextMonth}-${lastDay}`
  } else {
    const nextMonth = '00'
    const lastDay = new Date((date.getFullYear() + 1), date.getMonth() + 2, 0).getDate() + ''
    const nextYear = (date.getFullYear() + 1) + ''
    maxDate = `${nextYear}-${nextMonth}-${lastDay}`
  }

  console.log(arrivalDate, departureDate, 'date: ' + date, 'day: ' + day, 'month: ' + month,
    'year: ' + year, minDate, maxDate)
  renderBlock(
    'search-form-block',
    `
    <form id="form">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <div class="providers">
            <label><input id="homy" type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input id="flat-rent" type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${arrivalDate}" min="${minDate}" max="${maxDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${departureDate}" min="${minDate}" max="${maxDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          
          <div>
            <div><button class="form__btn">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  const btnSearch = document.querySelector('.form__btn')
  const city: HTMLInputElement = document.querySelector('#city')
  const checkInDate: HTMLInputElement = document.querySelector('#check-in-date')
  const checkOutDate: HTMLInputElement = document.querySelector('#check-out-date')
  const maxPrice: HTMLInputElement = document.querySelector('#max-price')
  const providerHomy: HTMLInputElement = document.querySelector('#homy')
  const providerFlatRent: HTMLInputElement = document.querySelector('#flat-rent')

  interface ISearchFormData {
    checkInDate: string,
    checkOutDate: string,
    maxPrice: number
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

  const placeF = (placeVal: IPlace | Error) => {
    console.log(placeVal)
    return placeVal
  }
  const search = async (evt: Event, place) => {
    evt.preventDefault()
    const cityValue = city.value
    const checkInDateValue = checkInDate.value
    const checkOutDateValue = checkOutDate.value
    const maxPriceValue = +maxPrice.value
    const data: ISearchFormData = {
      checkInDate: checkInDateValue,
      checkOutDate: checkOutDateValue,
      maxPrice: maxPriceValue
    }
    let allSearchValue = []

    if (providerHomy.checked) {
      console.log('homy checked')
      allSearchValue = [searchResult(data), ...allSearchValue]
      console.log(allSearchValue)
    }
    if (providerFlatRent.checked) {

      console.log('flat-rent checked', cityValue, new Date(checkInDateValue), new Date(checkOutDateValue))
      const flatRentSDK = new FlatRentSdk()
      flatRentSDK.search({
        'city': cityValue,
        'checkInDate': new Date(checkInDateValue),
        'checkOutDate': new Date(checkOutDateValue),
        'priceLimit': maxPriceValue
      }).then(res => {
        console.log(res)
        allSearchValue = [...res, ...allSearchValue]

        console.log(allSearchValue)
      })

    }

    fetch('http://localhost:3000/places')
      .then((res) => res.json())
      .then((places): void => {
        const result = place(places)
        renderSearchResultsBlock(result)
      })
      .catch(err => place(err))

  }


  const searchResult = (data: ISearchFormData) => {
    console.log(data)
    return data
  }
  btnSearch.addEventListener('click', (evt) => search(evt, placeF))
}