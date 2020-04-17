# websocket-client

## Install

```
npm i @happymonkey/websocket-client
```

Include in your `app.module.ts` :

```typescript
...
import {WebSocketClientModule} from 'web-socket-client';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ...
    WebSocketClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

## Example 
```typescript
...
import {WebSocketClientService} from 'web-socket-client';

...
constructor( public ws: WebSocketClientService ) {

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
    
    this.ws.onMessage.subscribe(( message: WebSocketMessage ) => {
        console.log( message.action, message.data );
    });

    this.ws.on('action_name').subscribe(( data: any ) => {
      console.log( 'Action received from server with data :', data );
    });
    
    this.ws.onTextMessage.subscribe(( payload: string ) => {
      console.log( 'Text message received :', payload );
    });

    // Connect to server
    this.ws.open('ws://localhost:8282');
    
    // Send action
    this.ws.send('action', {foo: 'bar'});

    // Send plain text message
    this.ws.sendText('plain text message');
    
    // Close connection
    this.ws.close();
    
    // Check if client is connected
    if ( this.ws.opened ) {
      console.log( 'WebSocket is ready' );
    }
    
    // Properties
    const url = this.ws.url;
    const readyState = this.ws.readyState;
}
```
