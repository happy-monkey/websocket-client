import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {WebSocketMessage} from './web-socket-message';

@Injectable({
  providedIn: 'root'
})
export class WebSocketClientService {
  private ws = null;
  private events: { [key: string]: Subject<any>; } = {};

  get opened(): boolean {
    return !!this.ws;
  }

  public onOpen = new Subject<Event>();
  public onClose = new Subject<Event>();
  public onError = new Subject<Error>();
  public onTextMessage = new Subject<string>();
  public onMessage = new Subject<WebSocketMessage>();

  constructor() { }

  public open( url ) {
    try {
      this.ws = new WebSocket(url);
      this.initEvents();
    } catch (e) {
      this.onError.next(e);
    }
  }

  public sendText( payload: string ) {
    if ( this.ws ) {
      this.ws.send(payload);
    }
  }

  public send( action: string, data: any = null, room = null ) {
    const message = new WebSocketMessage(action, data, room);
    this.sendText(JSON.stringify(message.toJSON()));
  }

  public close() {
    if ( this.ws ) {
      this.ws.close();
      this.ws = null;
    }
  }

  public on( action: string ): Subject<any> {
    const subject = new Subject<any>();
    this.events[action] = subject;
    return subject;
  }

  public off( action: string ) {
    if ( this.events[action] ) {
      delete this.events[action];
    }
  }

  private initEvents() {
    this.ws.onerror = (error) => {
      this.onError.next(error);
    };

    this.ws.onopen = (event) => {
      this.onOpen.next(event);
      this.ws.onclose = (e) => {
        this.onClose.next(e);
      };
      this.ws.onmessage = (e) => {
        this.handleMessage(e.data);
      };
    };
  }

  private handleMessage( payload: string ) {
    const message = WebSocketMessage.parseJSON(payload);
    if ( message ) {
      this.onMessage.next(message);
      if ( this.events[message.action] ) {
        this.events[message.action].next(message.data);
      }
    } else {
      this.onTextMessage.next(payload);
    }
  }
}
