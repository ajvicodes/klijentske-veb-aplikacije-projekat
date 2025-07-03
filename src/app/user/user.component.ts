import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { OrderModel } from '../../models/order.model';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-user',
  imports: [
    NgIf,
    NgFor,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterLink,
    MatExpansionModule,
    MatAccordion,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  // Fixed displayedColumns to match the actual columns in HTML
  public displayedColumns: string[] = ['id', 'movie', 'date', 'count', 'price', 'total', 'status', 'actions'];
  public user: UserModel | null = null
  public userCopy: UserModel | null = null
  public movieList: string[] = []

  public oldPasswordValue = ''
  public newPasswordValue = ''
  public repeatPasswordValue = ''

  constructor(private router: Router) {
    if (!UserService.getActiveUser()) {
      // User is not logged in
      // Redirect to homepage
      router.navigate(['/home'])
      return
    }

    this.user = UserService.getActiveUser()
    this.userCopy = JSON.parse(JSON.stringify(UserService.getActiveUser())) // Deep copy
    
    // Debug: Check if user has orders
    console.log('=== USER ORDERS DEBUG ===');
    console.log('User:', this.user);
    console.log('User orders:', this.user?.orders);
    console.log('Orders length:', this.user?.orders?.length);
    console.log('========================');
    
    MovieService.getMovies()
      .then(rsp => this.movieList = rsp.data)
  }

  public doChangePassword() {
    if (this.oldPasswordValue == '' || this.newPasswordValue == '') {
      alert('Password cant be empty')
      return
    }

    if (this.newPasswordValue !== this.repeatPasswordValue) {
      alert('Password dont match')
      return
    }

    if (this.oldPasswordValue !== this.user?.password) {
      alert('Password dont match')
      return
    }

    alert(
      UserService.changePassword(this.newPasswordValue) ?
        'Password has been changed' : 'Failed to change password'
    )

    this.oldPasswordValue = ''
    this.newPasswordValue = ''
    this.repeatPasswordValue = ''
  }

  public doUpdateUser() {
    if (this.userCopy == null) {
      alert('User not defined')
      return
    }

    UserService.updateUser(this.userCopy)
    this.user = UserService.getActiveUser()
    alert('User was updated')
  }

  public doPay(order: OrderModel) {
    if (UserService.changeOrderStatus('paid', order.id)) {
      this.user = UserService.getActiveUser()
    }
  }

  public doCancel(order: OrderModel) {
    if (UserService.changeOrderStatus('canceled', order.id)) {
      this.user = UserService.getActiveUser()
    }
  }

  public doRating(order: OrderModel, r: boolean) {
    if (UserService.changeRating(r, order.id)) {
      this.user = UserService.getActiveUser()
    }
  }
}