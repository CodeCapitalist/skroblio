import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { PlayerCardComponent } from "../player-card/player-card.component";

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [PlayerCardComponent],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent {
  constructor(public playerService: PlayerService){}
}
