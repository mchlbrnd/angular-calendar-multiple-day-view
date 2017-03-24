import { Component } from '@angular/core';
import { CalendarDayViewHourSegmentComponent } from 'angular-calendar/dist/esm/src/components/day/calendarDayViewHourSegment.component';

@Component({
  selector: 'mb-calendar-week-day-view-hour-segment',
  template: `
    <div class="cal-hour-segment" [ngClass]="segment.cssClass">
      <div [hidden]="!segment.isStart" class="cal-time">
        {{ segment.date | calendarDate:'dayViewHour':locale }}
      </div>
      &nbsp;
    </div>
  `
})
export class CalendarWeekDayViewHourSegmentComponent extends CalendarDayViewHourSegmentComponent {

}
