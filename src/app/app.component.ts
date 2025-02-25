import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShortCodeComponent } from './short-code/short-code.component';
import { MapComponent } from "./map/map/map.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShortCodeComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'IndoorBot.Bot.UI';
}
