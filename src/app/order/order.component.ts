import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ProjectionService } from '../../services/projection.service';
import { ProjectionModel } from '../../models/projection.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  imports: [MatCardModule, NgIf, MatInputModule, MatButtonModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  public movie: MovieModel | null = null;
  public projections: ProjectionModel[] = [];
  public selectedProjectionId: number | null = null;
  public ticketPrice: number = 0;
  public selectedTicketCount: number = 1;

  constructor(
    private route: ActivatedRoute, 
    private router: Router) {

    this.route.params.subscribe(params => {
      MovieService.getMoviesbyId(params['movieId'])
        .then(rsp => {
          this.movie = rsp.data;

          this.projections = ProjectionService.getProjectionsForMovie(this.movie.movieId);
          if (this.projections.length > 0) {
          this.selectedProjectionId = this.projections[0].id;
          this.ticketPrice = this.projections[0].ticketPrice;
        }
        });
    });
  }
  onProjectionChange() {
    const projection = ProjectionService.getProjectionById(this.selectedProjectionId!);
    if (projection) {
      this.ticketPrice = projection.ticketPrice;
    }
  }


  public doOrder() {
    if (!this.movie || !this.selectedProjectionId) return;

    Swal.fire({
      title: `Place an order to ${this.movie?.originalTitle}?`,
      text: "Orders can be canceled any time from your user profile!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        popup: 'bg-dark'
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make a reservation!"
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedProjection = ProjectionService.getProjectionById(this.selectedProjectionId!);
        
        const result = UserService.createOrder({
          id: new Date().getTime(),
          movieId: this.movie!.movieId,
          title: this.movie.originalTitle,
          ticketCount: this.selectedTicketCount,
          pricePerTicket: this.ticketPrice,
          projectionId: selectedProjection!.id,
          projectionDate: selectedProjection!.projectionDate,
          projectionTime: selectedProjection!.projectionTime,
          status: 'ordered',
          rating: null
        })
        
        result ? this.router.navigate(['/user']) :
          Swal.fire({
            title: "Failed crating an order",
            text: "Something is wrong with your order!",
            icon: "error"
          });
      }
    })
  }
}
