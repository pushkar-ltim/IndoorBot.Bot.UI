import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AskMeComponent } from '../ask-me/ask-me.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-short-code',
  templateUrl: './short-code.component.html',
  styleUrls: ['./short-code.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    AskMeComponent
  ]
})
export class ShortCodeComponent {
  shortCode = '';
  shortCodeError = '';
  shortCodeFormControl = new FormControl('', [Validators.required]);
  shortCodeEntered = false;
  showAskMe = false;
  jwtToken: string = "";

  constructor(private http: HttpClient) { }

  submitShortCode() {
    this.shortCodeError = '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Set Content-Type header
  });
    this.http.post<any>(`${environment.apiUrl}/Auth/redeemCode`, JSON.stringify(this.shortCode) , { headers }) // Send as JSON object
      .subscribe({
        next: (response) => {
          this.jwtToken = response.token;
          this.shortCodeEntered = true;
        },
        error: (error) => {
          this.shortCodeError = 'Invalid short code. Please try again.';
          console.error('Error redeeming short code:', error);
        }
      });
  }

  onAskMeClick() {
    this.showAskMe = true;
  }

  onViewScheduleClick() {
    // Implement navigation or logic for "View Schedule"
    alert('View Schedule clicked - Implement functionality here');
  }
}