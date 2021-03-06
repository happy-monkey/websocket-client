import { Component } from '@angular/core';
import {WebSocketClientService} from 'web-socket-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'websocket-library';

  constructor(
    public ws: WebSocketClientService
  ) {

    this.ws.onMessage.subscribe((message) => {
      console.log( 'new message', message.data );
    });

    // Subscribe to events
    this.ws.onOpen.subscribe(() => {
      console.log( 'Server is opened');
      this.ws.send('test', 'Salut').then((data) => {
        console.log( 'result from test : ', data );
      }).catch((err) => {
        console.warn(err.message);
      });
    });

    this.ws.onError.subscribe((error) => {
      console.error(error);
    });

    this.ws.onClose.subscribe(() => {
      console.log( 'Connection closed' );
    });

    this.ws.on<ServerReadyResponse>('server_ready').subscribe(( data ) => {
      console.log( 'Action received from server with data : ', data );
    });

    // Connect to server
    this.ws.open('ws://localhost:8282/test?login=salut !');
  }
}

export class Player {
  id: number;
  id_lang: number;​​
  id_user: number|null;
  tag: string;
  login: string;
  avatar: string|null;
  diamonds: number;
  trophies: number;
  created_at: string;
  updated_at: string|null;
}

export class ServerReadyResponse {
  player: Player;
  token: string;
}
