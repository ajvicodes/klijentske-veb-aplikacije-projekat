import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { NgIf, NgFor } from '@angular/common'; // Add NgFor import
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ProjectionModel } from 'src/models/projection.model';
import { ProjectionService } from 'src/services/projection.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-details',
  imports: [NgIf, NgFor, MatCardModule, MatListModule, MatButtonModule, RouterLink], // Add NgFor to imports
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  public movie: MovieModel | null = null;
  public projection: ProjectionModel | null = null;

  constructor(private route: ActivatedRoute, public utils: UtilsService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      MovieService.getMoviesbyId(id).then(rsp => {
        this.movie = rsp.data;
        if(this.movie) {
          const projections = ProjectionService.getProjectionsForMovie(this.movie.movieId);
          this.projection = projections.length > 0 ? projections[0] : null;
        }
      }).catch(error => {
        console.error('Error fetching movie:', error); // Add error handling
      });
    });
  }
}