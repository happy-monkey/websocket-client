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

    // Subscribe to events
    this.ws.onOpen.subscribe(() => {
      console.log( 'Server is ready');
    });

    this.ws.onError.subscribe((error) => {
      console.error(error);
    });

    this.ws.onClose.subscribe(() => {
      console.log( 'Connection closed' );
    });

    this.ws.on('action_name').subscribe(( data ) => {
      console.log( 'Action received from server with data : ', data );
    });

    // Connect to server
    this.ws.open('ws://localhost:8282');

    // Send action
    this.ws.send('action', {foo: 'bar'});

    // Close connection
    this.ws.close();

    // Check if client is connected
    if ( this.ws.opened ) {
      console.log( 'WebSocket is ready' );
    }
  }
}
