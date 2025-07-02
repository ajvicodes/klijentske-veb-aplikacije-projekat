

export interface OrderModel {
    id: number
    movieId: number
    title: string
    projectionId: number
    projectionDate: string;
    projectionTime: string;
    ticketCount: number;
    pricePerTicket: number;
    status: 'ordered' | 'paid' | 'canceled',
    rating: null | boolean
}