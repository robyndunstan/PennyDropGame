import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { DiceComponent } from "./dice/dice.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PlayerComponent } from "./player/player.component";
import { PennySlotComponent } from "./penny-slot/penny-slot.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule, DiceComponent, MatSlideToggleModule, PlayerComponent, PennySlotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Penny Drop Game';
  faDiceTwo = faDiceTwo;
}
