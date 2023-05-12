import {Component} from '@angular/core';
import {Doodad, WebsocketService} from "./services/websocket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Doodads';
  doodads: Doodad[] = [];

  constructor(private websocketService: WebsocketService) {
    websocketService.messages.subscribe(msg => {
      console.log(`Received message of type: ${msg.type}`);
      if (msg.type === 'doodads.all') {
        this.doodads = msg.doodads!;
      } else if (msg.type === 'doodads.update') {
        let found = false;
        this.doodads.forEach((doodad, index) => {
          if (doodad.id === msg.doodad!.id) {
            this.doodads[index] = msg.doodad!;
            found = true;
          }
        });
        if (!found) {
          this.doodads.push(msg.doodad!);
        }
      }
    });
  }
}
