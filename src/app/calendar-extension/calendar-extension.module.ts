import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarWeekDayViewComponent,  } from './components/week-day/calendarWeekDayView.component';
import { CalendarWeekDayViewHourSegmentComponent  } from './components/week-day/calendarWeekDayViewHourSegment.component';
import { CalendarModule } from 'angular-calendar';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';

@NgModule({
  imports: [
    CommonModule,
    ResizableModule,
    DragAndDropModule,
    CalendarModule.forRoot()
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
