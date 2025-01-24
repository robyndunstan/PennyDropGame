import { Component, Input } from '@angular/core';
import { PlayerOrientation } from '../app.model';
import { DiceComponent } from "../dice/dice.component";

@Component({
  selector: 'app-player',
  imports: [DiceComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  @Input() playerOrientation: PlayerOrientation = PlayerOrientation.Horizontal;
}
