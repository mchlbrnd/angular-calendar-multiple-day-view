import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CalendarMultipleDayViewComponent } from './components/days/calendarMultipleDayView.component';

@NgModule({
  imports: [
    CommonModule,
    ResizableModule,
    DragAndDropModule,
    CalendarModule.forRoot()
  ],
  declarations: [
    CalendarMultipleDayViewComponent,
  ],
  exports: [
    CalendarMultipleDayViewComponent,
  ]
})
export class CalendarExtensionModule { }
