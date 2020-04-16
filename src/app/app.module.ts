import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {WebSocketClientModule} from 'web-socket-client';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WebSocketClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
