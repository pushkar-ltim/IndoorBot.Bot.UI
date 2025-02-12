import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../environments/environment';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface BotResponse {
  message: string
}

@Component({
  selector: 'app-ask-me',
  templateUrl: './ask-me.component.html',
  styleUrls: ['./ask-me.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ]
})
export class AskMeComponent {
  @Output() test:any;
  @Input() jwtToken: string = "";
  userQuery = '';
  messages: ChatMessage[] = [];
  errorMessage = '';

  constructor(private http: HttpClient) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jwtToken'] && this.jwtToken) {
      this.messages.push({ sender: 'bot', text: 'Welcome! How can I help you today?' });
    }
  }

  sendMessage() {
    this.messages.push({ sender: 'user', text: this.userQuery });

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtToken}`
    });

    // Use a GET request with query parameters
    this.http.get<BotResponse>(`${environment.apiUrl}/api/Bot/GetBotResponse`, { 
      headers,
      params: { userQuery: this.userQuery },
      
    })
    .subscribe({
      next: (response) => {
        console.log(response)
        this.messages.push({ sender: 'bot', text: response.message }); // Assuming response is the string
        this.userQuery = '';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error getting response. Please try again.';
        console.error('Error sending message:', error);
      }
    });
  }
}