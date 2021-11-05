const database = [
    {
      id: '1',
      title: 'Заголовок',
      details: 'Описание',
      photos: ['result-1'],
      coordinates: [],
      bookedDates: [],
      price: 12000
    },
    {
      id: '2',
      title: 'Заголовок 2',
      details: 'Описание 2',
      photos: ['result-2'],
      coordinates: [],
      bookedDates: [],
      price: 4500
    },
  ]
  
  export function cloneDate(date) {
    return new Date(date.getTime())
  }
  
  export function addDays(date, days) {
    date.setDate(date.getDate() + days)
    return date
  }
  
  export const backendPort = 3040
  export const localStorageKey = 'flat-rent-db'
  
  export class FlatRentSdk {
    constructor() {
      if (this._readDatabase() == null) {
        this._writeDatabase(database)
      }
  
      this.database = this._readDatabase()
    }
  
    /**
     * Get flat by ID.
     *
     * @param {string} id Flat ID.
     * @returns {Promise<Object|null>} Flat.
     */
    get(id) {
      const flat = this.database.find((item) => {
        return item.id === id
      })
  
      return Promise.resolve(flat == null ? flat : this._formatFlatObject(flat))
    }
  
    /**
     * Search for flats.
     *
     * @param {Object} parameters Search parameters
     * @param {string}parameters.city City name
     * @param {Date} parameters.checkInDate Check-in date
     * @param {Date} parameters.checkOutDate Check-out date
     * @param {number} [parameters.priceLimit] Max price for a night
     * @returns {Promise<[]>} List of suitable flats.
     */
    search(parameters) {
      console.log(parameters,parameters.city, parameters.city !== 'Санкт-Петербург')
      return new Promise((resolve, reject) => {
        try {
          if (parameters.city !== 'Санкт-Петербург') {
            throw new Error(`Passed unsupported city - "${parameters.city}".`)
          }
  
          if (!(parameters.checkInDate instanceof Date) || !(parameters.checkOutDate instanceof Date)) {
            throw new Error(`Passed invalid check-in or check-out date - from "${parameters.checkInDate}" to "${parameters.checkOutDate}".`)
          }
          this._assertDatesAreCorrect(parameters.checkInDate, parameters.checkOutDate)
  
          if (parameters.priceLimit != null && (isNaN(parameters.priceLimit) || !isFinite(parameters.priceLimit))) {
            throw new Error(`Passed invalid price limit - "${parameters.priceLimit}".`)
          }
  
          let flats = this.database
  
          if (parameters.priceLimit != null) {
            flats = flats.filter((flat) => {
              return flat.price <= parameters.priceLimit
            })
          }
  
          const dateRange = this._generateDateRange(parameters.checkInDate, parameters.checkOutDate)
          flats = flats.filter((flat) => {
            return this._areAllDatesAvailable(flat, dateRange)
          })
  
          flats = flats.map((flat) => {
            return this._formatFlatObject(flat, dateRange.length - 1)
          })
  
          resolve(flats)
        } catch (error) {
          reject(error)
        }
      })
  
  
    }
  
    /**
     * Book flat.
     *
     * @param {number} flatId
     * @param {Date} checkInDate
     * @param {Date} checkOutDate
     * @returns {number}
     */
    book(flatId, checkInDate, checkOutDate) {
      return new Promise((resolve, reject) => {
        try {
          const flat = this.database.find((item) => {
            return item.id === flatId
          })
  
          if (flat == null) {
            throw new Error('There is no flat with ID "' + flatId + '".')
          }
          this._assertDatesAreCorrect(checkInDate, checkOutDate)
  
          const datesToBook = this._generateDateRange(checkInDate, checkOutDate)
          if (!this._areAllDatesAvailable(flat, datesToBook)) {
            throw new Error(`Flat ${flat.id} is not available for dates ${datesToBook.join(',')}.`)
          }
  
          const bookedDates = datesToBook.map((date) => {
            return date.getTime()
          })
          flat.bookedDates.push(...bookedDates)
          for (let i = 0; i < this.database.length; i++) {
            if (this.database[i].id === flat.id) {
              this.database[i] = flat
              break
            }
          }
          this._writeDatabase(this.database)
  
          resolve(this._generateTransactionId())
        } catch (error) {
          reject(error)
        }
      })
    }
  
    _assertDatesAreCorrect(checkInDate, checkOutDate) {
      const today = new Date()
      this._resetTime(today)
      this._resetTime(checkInDate)
      this._resetTime(checkOutDate)
  
      const diffToday = this._calculateDifferenceInDays(today, checkInDate)
      if (diffToday < 0) {
        throw new Error('Check-in date can\'t be in the past.')
      }
  
      const diffCheck = this._calculateDifferenceInDays(checkInDate, checkOutDate)
      if (diffCheck < 0) {
        throw new Error('Check-out date must be grater then check-in date.')
      }
    }
  
    _resetTime(date) {
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
    }
  
    _calculateDifferenceInDays(startDate, endDate) {
      const difference = endDate.getTime() - startDate.getTime()
  
      return Math.floor(difference / (1000 * 60 * 60 * 24))
    }
  
    _generateDateRange(from, to) {
      const dates = []
      const differenceInDays = this._calculateDifferenceInDays(from, to)
  
      dates.push(new Date(from.getFullYear(), from.getMonth(), from.getDate()))
      for (let i = 1; i <= differenceInDays; i++) {
        dates.push(new Date(from.getFullYear(), from.getMonth(), from.getDate() + i))
      }
  
      return dates
    }
  
    _generateTransactionId = () => {
      const min = 1000
      const max = 9999
      const num = Math.random() * (max - min) + min
  
      return Math.floor(num)
    }
  
    _areAllDatesAvailable(flat, dateRange) {
      return dateRange.every((date) => {
        return !flat.bookedDates.includes(date.getTime())
      })
    }
  
    _formatFlatObject(flat, nightNumber) {
      const formattedFlat = Object.assign({}, flat)
  
      formattedFlat.photos = formattedFlat.photos.map((photoUrl) => {
        return `http://localhost:${backendPort}/img/${photoUrl}`
      })
  
      if (nightNumber != null) {
        formattedFlat.totalPrice = nightNumber * formattedFlat.price
        delete formattedFlat.price
      }
  
      return formattedFlat
    }
  
    _readDatabase() {
      const data = window.localStorage.getItem(localStorageKey)
  
      if (data == null) {
        return data
      }
  
      return JSON.parse(data)
    }
  
    _writeDatabase(database) {
      window.localStorage.setItem(localStorageKey, JSON.stringify(database))
    }
  
    _syncDatabase(database) {
      this._writeDatabase(database)
      this.database = this._readDatabase()
    }
  }