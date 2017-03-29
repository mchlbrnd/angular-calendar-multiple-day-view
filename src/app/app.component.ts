import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { BehaviorSubject, Observable } from 'rxjs';
import { addDays, addHours } from 'date-fns';

export interface SomeCustomEvent extends CalendarEvent {
  id: number;
}

const eventColors: any[] = [
  {
    primary: 'darkblue',
    secondary: 'lightyellow'
  },
  {
    primary: 'red',
    secondary: 'lightyellow'
  },
  {
    primary: 'yellow',
    secondary: 'lightyellow'
  },
  {
    primary: 'darkgreen',
    secondary: 'lightyellow'
  },
  {
    primary: 'pink',
    secondary: 'lightyellow'
  },
  {
    primary: 'brown',
    secondary: 'lightyellow'
  },
  {
    primary: 'violet',
    secondary: 'lightyellow'
  }
];

const getRandomEvent = (id: number, fromDate: Date = new Date()): SomeCustomEvent => {
  const eventAddDaysToStart = Math.floor((Math.random() * 7));
  const eventAddHoursToStart = Math.floor((Math.random() * 6) + 1);
  const eventDurationInHours = Math.floor((Math.random() * 2) + 1);
  const colorIndex = Math.floor((Math.random() * 5) + 1);
  const allDay = !Math.floor(Math.random() * 10);

  let start = addDays(fromDate, eventAddDaysToStart);
  let end = addDays(fromDate, eventAddDaysToStart);
  start = addHours(start, eventAddHoursToStart);
  end = addHours(end, eventAddHoursToStart + eventDurationInHours);

  if (allDay) {
    const eventAddDaysToEnd = Math.floor((Math.random() * 4) + 3);
    end = addDays(end, eventAddDaysToEnd);
  }

  return {
    id,
    start,
    end,
    allDay,
    title: `Event ${id}`,
    color: eventColors[colorIndex],
    draggable: true,
    resizable: {
      beforeStart: true,
      afterEnd: true
    }
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  viewDate = new Date();

  private events$ = new BehaviorSubject<SomeCustomEvent[]>([]);

  ngOnInit(): void {
    Observable
      .range(0, 100)
      .map(id => getRandomEvent(id, new Date('2017-03-29 06:00')))
      .reduce((events, event) => [...events, event], [])
      .subscribe((events) => this.events$.next(events));
  }

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
