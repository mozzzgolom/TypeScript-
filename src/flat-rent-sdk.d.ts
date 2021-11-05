export class FlatRentSdk {
    get(id: string): Promise<object | null>
    search(parameters: {
        'city': string,
        'checkInDate': Date,
        'checkOutDate': Date,
        'priceLimit': number,
    }): Promise<[]>
    book(flatId: number, checkInDate: Date, checkOutDate: Date): number
}