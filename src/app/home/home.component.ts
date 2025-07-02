import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { AxiosError } from 'axios';
import { MovieModel } from '../../models/movie.model';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-home',
  imports: [JsonPipe, NgIf, NgFor, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  movies: MovieModel[] | null = null
  error: string | null = null //po defaultu su uvek public

  constructor() {
    MovieService.getMovies(0, 3)
    .then(rsp => this.movies = rsp.data)
    .catch((e:AxiosError) => this.error = `${e.code}: ${e.message}`)
  }
  public formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS')
  }
}
