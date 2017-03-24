import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CalendarModule } from 'angular-calendar';
import { CalendarExtensionModule } from './calendar-extension/calendar-extension.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CalendarModule.forRoot(),
    CalendarExtensionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
