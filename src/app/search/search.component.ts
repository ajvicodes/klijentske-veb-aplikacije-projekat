import { Component } from '@angular/core';
import { MovieModel } from 'src/models/movie.model';
import { MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule} from '@angular/common';


@Component({
  selector: 'app-search',
  imports: [
    MatTableModule,
    NgIf,
    NgFor,
    MatButtonModule,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  displayedColumns: string[] =['movieId', 'originalTitle', 'genre', 'runTime', 'actors', 'director',
    'startedAt', 'projectionDate', 'projectionTime', 'ticketPrice', 'actions']
  dataSource: MovieModel[] | null = null;

public constructor() {
  MovieService.getMovies()
  .then(rsp => {
    console.log('Movies fetched:', rsp.data.length, rsp.data);
    this.dataSource = rsp.data.slice(0, 15);
  });
}

}
