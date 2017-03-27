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

  events$ = Observable.of(<CalendarEvent[]>[
    {
      title: 'Event 1',
      color: {
        primary: 'darkblue',
        secondary: 'lightblue'
      },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      start: new Date('2017-03-27 11:00'),
      end: new Date('2017-03-27 12:00')
    },
    {
      title: 'Event 2',
      color: {
        primary: 'yellow',
        secondary: 'lightyellow'
      },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      start: new Date('2017-03-28 15:00'),
      end: new Date('2017-03-28 16:00')
    }]);
}

/*private _refreshView() {
 this.views$ = Observable
 .range(0, this.numberOfDays)
 .map(n => addDays(this.startViewDate, n))
 .map(day => {
 return {
 date: day,
 events: this.events.filter(({start, end}) => isSameDay(day, start) || isSameDay(day, end) || (isAfter(day, start) && isBefore(day, end)))
 };
 })
 .reduce((days, day) => [...days, day], []);
 }*/
