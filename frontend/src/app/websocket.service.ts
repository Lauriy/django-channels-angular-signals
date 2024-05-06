import {Injectable} from '@angular/core';
import {AnonymousSubject, Subject} from 'rxjs/internal/Subject';
import {map, Observable, Observer} from 'rxjs';

const DOODADS_URL = 'ws://localhost:8000/ws/doodads-stream/';

export interface Doodad {
  id: number;
  name: string;
  state: string;
}

export interface Message {
  type: string;
  doodads: Doodad[] | undefined;
  doodad: Doodad | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subject!: AnonymousSubject<MessageEvent>;
  public messages$: Subject<Message>;

  constructor() {
    this.messages$ = <Subject<Message>>this.connect(DOODADS_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          console.debug(response.data);

          return JSON.parse(response.data);
        }
      )
    );
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.debug('Successfully connected: ' + url);
    }

    return this.subject;
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);

      return ws.close.bind(ws);
    });
    let observer: any = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.debug('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };

    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
