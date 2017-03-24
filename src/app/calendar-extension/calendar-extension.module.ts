import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarWeekDayViewComponent,  } from './components/week-day/calendarWeekDayView.component';
import { CalendarWeekDayViewHourSegmentComponent  } from './components/week-day/calendarWeekDayViewHourSegment.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CalendarWeekDayViewComponent,
    CalendarWeekDayViewHourSegmentComponent
  ],
  exports: [
    CalendarWeekDayViewComponent,
    CalendarWeekDayViewHourSegmentComponent
  ]
})
export class CalendarExtensionModule { }
