import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Doodad, WebsocketService} from "./websocket.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
  websocketService: WebsocketService;
  websocketSubscription: Subscription;
  internalDoodads: Doodad[] = [];
  doodads = signal<Doodad[]>([]);

  constructor() {
    this.websocketService = inject(WebsocketService);
    this.websocketSubscription = this.websocketService.messages$.subscribe(msg => {
      console.debug(`Received message of type: ${msg.type}`);
      if (msg.type === 'doodads.all') {
        this.internalDoodads = msg.doodads!;
      } else if (msg.type === 'doodads.update') {
        let found = false;
        this.internalDoodads.forEach((doodad, index) => {
          if (doodad.id === msg.doodad!.id) {
            this.internalDoodads[index] = msg.doodad!;
            found = true;
          }
        });
        if (!found) {
          this.internalDoodads.push(msg.doodad!);
        }
      }
      this.doodads.update(() => [...this.internalDoodads]);
    });
  }

  ngOnDestroy() {
    this.websocketSubscription.unsubscribe();
  }
}
