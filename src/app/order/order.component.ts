import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';
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
  imports: [MatCardModule, NgIf, NgFor, MatInputModule, MatButtonModule, MatSelectModule, MatFormFieldModule, FormsModule],
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
      const movieId = +params['movieId'];
      
      MovieService.getMoviesbyId(movieId)
        .then(rsp => {
          this.movie = rsp.data;

          if (this.movie) {
            this.projections = ProjectionService.getProjectionsForMovie(this.movie.movieId);
            if (this.projections.length > 0) {
              this.selectedProjectionId = this.projections[0].id;
              this.ticketPrice = this.projections[0].ticketPrice;
            }
          }
        })
        .catch(error => {
          console.error('Error loading movie:', error);
        });
    });
  }

  onProjectionChange() {
    if (this.selectedProjectionId) {
      const projection = ProjectionService.getProjectionById(this.selectedProjectionId);
      if (projection) {
        this.ticketPrice = projection.ticketPrice;
      }
    }
  }

  public doOrder() {
    if (!this.movie || !this.selectedProjectionId) return;

    // Debug: Check if user is logged in
    console.log('=== DEBUGGING ORDER CREATION ===');
    console.log('Active user from localStorage:', localStorage.getItem('active'));
    console.log('Active user from UserService:', UserService.getActiveUser());
    console.log('All users:', UserService.retrieveUsers());

    // Check if user is logged in
    const activeUser = UserService.getActiveUser();
    if (!activeUser) {
      Swal.fire({
        title: "Not logged in",
        text: "You must be logged in to make a reservation. Please login first.",
        icon: "warning"
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

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
        
        if (selectedProjection) {
          const orderData = {
            id: new Date().getTime(),
            movieId: this.movie!.movieId,
            title: this.movie!.originalTitle,
            ticketCount: this.selectedTicketCount,
            pricePerTicket: this.ticketPrice,
            projectionId: selectedProjection.id,
            projectionDate: selectedProjection.projectionDate,
            projectionTime: selectedProjection.projectionTime,
            status: 'ordered' as const,
            rating: null
          };
          
          // Debug: Log the order data and user info
          console.log('Order data being sent:', orderData);
          console.log('Active user before creating order:', UserService.getActiveUser());
          console.log('localStorage active key:', localStorage.getItem('active'));
          
          try {
            const orderResult = UserService.createOrder(orderData);
            console.log('Order result:', orderResult);
            
            if (orderResult) {
              Swal.fire({
                title: "Order created successfully!",
                text: "Your reservation has been made.",
                icon: "success"
              }).then(() => {
                this.router.navigate(['/user']);
              });
            } else {
              // More detailed error message
              const activeUserEmail = localStorage.getItem('active');
              const users = UserService.retrieveUsers();
              const userExists = users.find(u => u.email === activeUserEmail);
              
              let errorMessage = "UserService.createOrder returned false. ";
              if (!activeUserEmail) {
                errorMessage += "No active user found in localStorage.";
              } else if (!userExists) {
                errorMessage += `Active user email '${activeUserEmail}' not found in users array.`;
              } else {
                errorMessage += "Unknown error occurred.";
              }
              
              Swal.fire({
                title: "Failed creating an order",
                text: errorMessage,
                icon: "error"
              });
            }
          } catch (error) {
            console.error('Error creating order:', error);
            Swal.fire({
              title: "Error creating order",
              text: "An exception occurred: " + (error instanceof Error ? error.message : 'Unknown error'),
              icon: "error"
            });
          }
        }
      }
    });
  }
}