import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  viewDate = Date.now();
  events$: Observable<CalendarEvent[]> = Observable.of([
    {
      title: 'Event 1',
      color: {
        primary: 'darkblue',
        secondary: 'lightblue'
      },
      start: new Date('2017-03-24 14:00'),
      end: new Date('2017-03-24 15:00')
    }]);
}
