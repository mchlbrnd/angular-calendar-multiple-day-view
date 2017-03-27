import { Component } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SomeCustomEvent extends CalendarEvent {
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  viewDate = Date.now();

  private events$ = new BehaviorSubject<SomeCustomEvent[]>(
    [
      {
        id: 1,
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
        id: 2,
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
      }
    ]
  );

  onEventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    const customEvent = <SomeCustomEvent>event;
    const eventIndex = this.events$.value.findIndex(e => e.id === customEvent.id);
    const events = [
      ...this.events$.value.slice(0, eventIndex),
      Object.assign(customEvent, {start: newStart, end: newEnd}),
      ...this.events$.value.slice(eventIndex + 1)
    ];
    this.events$.next(events);
  }
}
