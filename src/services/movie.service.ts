//klasa koja ce biti dostupna u drugim fajlovima
//hibrid izmedju type i js, u js bi moralo preko singletone-a
//ovde cemo definisati static metode unutar service a gore cemo def posebnu promenljivu
//kako ne bismo ocekivali izvrsavanje then-a unutar funkcije, wrapper funkcije ce biti wrapper originalne
import axios from 'axios';

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api',
    headers: {
        'Accept': 'application/json', //zelim da dobijem json response a ne xml ili nesto drugo
        'X-Client-Name': 'KVA/2025'

    },
    validateStatus: (status: number) => {
        return status === 200 // vrati rsp samo ako je 200, else izuzetak

    }

})
export class MovieService {
    static async getMovies(page: number = 0, size: number = 10) {
        return client.request({
            url: '/movie',
            method: 'GET',
            params: {
                'page': page,
                'size': size,
                'sort': 'startDate, asc',
                'type': 'projekcija' //kasnije ce se ubaciti
            }
        })
    }
    static async getMoviesbyId(id: number) {
        return client.get(`/movie/${id}`) //drugi nacin pisanja sa tmplt tagovima
    }
}