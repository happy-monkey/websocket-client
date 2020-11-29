import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {WebSocketMessage} from './web-socket-message';

@Injectable({
  providedIn: 'root'
})
export class WebSocketClientService {
  private ws: WebSocket = null;
  private events: { [key: string]: Subject<any>; } = {};
  private reopenTimeout = null;

  private lastWsUrl: string = null;
  private lastWsProtocols: string|string[] = null;

  get opened(): boolean {
    return this.readyState === WebSocket.OPEN;
  }

  get readyState(): number|null {
    return this.ws ? this.ws.readyState : null;
  }

  get url(): string|null {
    return this.ws ? this.ws.url : null;
  }

  public onOpen = new Subject<Event>();
  public onClose = new Subject<Event>();
  public onError = new Subject<Event|Error>();
  public onTextMessage = new Subject<string>();
  public onMessage = new Subject<WebSocketMessage>();

  constructor() { }

  public open( url: string, protocols?: string|string[] ) {
    if( this.reopenTimeout ) {
      clearTimeout(this.reopenTimeout);
    }
    this.lastWsUrl = url;
    this.lastWsProtocols = protocols || null;
    this.ws = protocols ? new WebSocket(url, protocols) : new WebSocket(url);
    this.initEvents();
  }

  public reopen( timeout?: number ) {
    if ( !this.lastWsUrl ) {
      throw new Error('Method open has never been called');
    }

    this.reopenTimeout = setTimeout( () => {
      this.reopenTimeout = null;
      this.open(this.lastWsUrl, this.lastWsProtocols);
    }, timeout);
  }

  public sendText( payload: string ) {
    if ( this.ws ) {
      this.ws.send(payload);
    }
  }

  public send<T>( action: string, data: any = null, room = null ) {
    return new Promise<T>((resolve, reject) => {
      const callbackID = Math.random().toString(36).substr(2, 9);
      const message = new WebSocketMessage(action, data, room, callbackID);
      this.on<T>(callbackID + '_success').subscribe((result) => {
        this.off(callbackID + '_*');
        resolve(result);
      });
      this.on<any>(callbackID + '_error').subscribe((err) => {
        this.off(callbackID + '_*');
        reject(new Error(err.message));
      });
      this.sendText(JSON.stringify(message.toJSON()));
    });
  }

  public close() {
    if ( this.ws ) {
      this.ws.close();
      this.ws = null;
    }
    if( this.reopenTimeout ) {
      clearTimeout(this.reopenTimeout);
      this.reopenTimeout = null;
    }
  }

  public on<T>( action: string ): Subject<T> {
    const subject = new Subject<T>();
    this.events[action] = subject;
    return subject;
  }

  public off( action: string ) {
    const regex = new RegExp(action, 'i');
    for ( const name in this.events ) {
      if ( this.events.hasOwnProperty(name) && name.match(regex) ) {
        delete this.events[name];
      }
    }
  }

  private initEvents() {
    this.ws.onerror = (error) => {
      this.onError.next(error);
    };

    this.ws.onopen = (event) => {
      this.ws.onclose = (e) => {
        this.onClose.next(e);
      };
      this.ws.onmessage = (e) => {
        this.handleMessage(e.data);
      };
      this.onOpen.next(event);
    };
  }

  private handleMessage( payload: string ) {
    const message = WebSocketMessage.parseJSON(payload);
    if ( message ) {
      if ( !message.isCallback ) {
        this.onMessage.next(message);
      }
      if ( this.events[message.action] ) {
        this.events[message.action].next(message.data);
      }
    } else {
      this.onTextMessage.next(payload);
    }
  }
}
