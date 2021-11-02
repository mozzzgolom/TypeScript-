import { renderBlock } from './lib.js'

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
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
         <!-- <div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div> -->
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
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
