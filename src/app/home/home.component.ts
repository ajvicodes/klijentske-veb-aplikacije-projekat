import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { AxiosError } from 'axios';
import { MovieModel } from '../../models/movie.model';


@Component({
  selector: 'app-home',
  imports: [JsonPipe, NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  movies: MovieModel[] | null = null
  error: string | null = null //po defaultu su uvek public

  constructor() {
    MovieService.getMovies()
    .then(rsp => this.movies = rsp.data)
    .catch((e:AxiosError) => this.error = `${e.code}: ${e.message}`)
  }
}
