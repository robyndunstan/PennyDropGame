import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-dice',
  imports: [FontAwesomeModule, MatButtonModule],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss'
})
export class DiceComponent {
  faDiceTwo = faDiceTwo;
}
