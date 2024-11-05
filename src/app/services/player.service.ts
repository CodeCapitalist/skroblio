import { Injectable, signal, WritableSignal } from '@angular/core';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  players: WritableSignal<Player[]> = signal([]);
  
  constructor() {
    this.addPlayer(new Player("Cat"));
    this.addPlayer(new Player("Dog"));
  }

  public addPlayer(player: Player){
    this.players.update(players => [...players, player]); 
  }
}
