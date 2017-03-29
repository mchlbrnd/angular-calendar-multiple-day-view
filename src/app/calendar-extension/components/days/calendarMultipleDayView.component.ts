import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  LOCALE_ID,
  Inject,
  OnInit,
  OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import { getDayViewHourGrid, CalendarEvent, DayView, DayViewHour, DayViewHourSegment, DayViewEvent } from 'calendar-utils';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { ResizeEvent } from 'angular-resizable-element';
import { addMinutes, differenceInDays, addHours } from 'date-fns';
import { CalendarDragHelper } from 'angular-calendar/dist/esm/src/providers/calendarDragHelper.provider';
import { CalendarResizeHelper } from 'angular-calendar/dist/esm/src/providers/calendarResizeHelper.provider';
import { CalendarEventTimesChangedEvent } from 'angular-calendar/dist/esm/src/interfaces/calendarEventTimesChangedEvent.interface';
import { getMultipleDayView, MultipleDayView } from '../../util/calendar-utils';

/**
 * @hidden
 */
const SEGMENT_HEIGHT: number = 30;

/**
 * Shows all events on a given day. Example usage:
 *
 * ```
 * &lt;mb-calendar-nultiple-day-view
 *  [viewDate]="viewDate"
 *  [events]="events"&gt;
 * &lt;/mb-calendar-multiple-day-view&gt;
 * ```
 */
@Component({
  selector: 'mb-calendar-multiple-day-view',
  styles: [`
    .cal-multiple-day-view .cal-day-headers {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      -js-display: flex;
      display: flex;
      margin-bottom: 3px;
      border: 1px solid #e1e1e1;
      margin-left: 2px;
      margin-right: 2px; 
    }

    .cal-multiple-day-view .cal-day-headers .cal-header {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      text-align: center;
      padding: 5px; 
    }

    .cal-multiple-day-view .cal-day-headers .cal-header:not(:last-child) {
      border-right: 1px solid #e1e1e1; 
    }

    .cal-multiple-day-view .cal-day-headers .cal-header:hover,
    .cal-multiple-day-view .cal-day-headers .cal-drag-over {
      background-color: #ededed; 
    }

    .cal-multiple-day-view .cal-day-headers span {
      font-weight: 400;
      opacity: 0.5; 
    }

    .cal-multiple-day-view .cal-draggable {
      cursor: move; 
    }

    .cal-multiple-day-view .cal-event.cal-starts-within-week {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px; 
    }

    .cal-multiple-day-view .cal-event.cal-ends-within-week {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px; 
    }

    .cal-multiple-day-view .cal-header.cal-today {
      background-color: #e8fde7; 
    }

    .cal-multiple-day-view .cal-header.cal-weekend span {
      color: #8b0000; 
    }

    .cal-multiple-day-view .cal-event,
    .cal-multiple-day-view .cal-header {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; 
    }

    .cal-multiple-day-view .cal-day-view .cal-hour-rows {
      width: 100%;
      border: solid 1px #e1e1e1;
      overflow-x: scroll;
      position: relative; 
    }

    .cal-multiple-day-view .cal-day-view /deep/ .cal-hour:nth-child(odd) {
      background-color: #fafafa; 
    }

    .cal-multiple-day-view .cal-day-view /deep/ .cal-hour-segment {
      height: 30px; 
    }

    .cal-multiple-day-view .cal-day-view /deep/ .cal-hour:not(:last-child) .cal-hour-segment,
    .cal-multiple-day-view .cal-day-view /deep/ .cal-hour:last-child :not(:last-child) .cal-hour-segment {
      border-bottom: thin dashed #e1e1e1; 
    }

    .cal-multiple-day-view .cal-day-view /deep/ .cal-time {
      font-weight: bold;
      padding-top: 5px;
      width: 70px;
      text-align: center; 
    }

    .cal-multiple-day-view .cal-day-view .cal-hour-segment:hover,
    .cal-multiple-day-view .cal-day-view .cal-drag-over .cal-hour-segment {
      background-color: #ededed; 
    }

    .cal-multiple-day-view .cal-day-view .cal-event {
      position: absolute;
      border: solid 1px;
      padding: 5px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; 
    }

    .cal-multiple-day-view .cal-day-view .cal-draggable {
      cursor: move; 
    }

    .cal-multiple-day-view .cal-day-view .cal-event.cal-starts-within-day {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px; 
    }

    .cal-multiple-day-view .cal-day-view .cal-event.cal-ends-within-day {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px; 
    }

    .cal-multiple-day-view .cal-day-view /deep/ .cal-all-day-event {
      padding: 8px;
      border: solid 1px; 
    }
  `
  ],
  template: `
    <div class="cal-multiple-day-view" #multipleDayViewContainer>
      <div class="cal-day-headers" [style.marginLeft.px]="70">
        <div
          class="cal-header"
          *ngFor="let dayView of view.views"
          [style.maxWidth.px]="dayWidth"
          [class.cal-past]="dayView.isPast"
          [class.cal-today]="dayView.isToday"
          [class.cal-future]="dayView.isFuture"
          [class.cal-weekend]="dayView.isWeekend"
          [class.cal-drag-over]="dayView.dragOver"
          (click)="dayClicked.emit({date: dayView.viewDate})"
          mwlDroppable
          (dragEnter)="dayView.dragOver = true"
          (dragLeave)="dayView.dragOver = false"
          (drop)="dayView.dragOver = false; eventDropped.emit({event: $event.dropData.event, newStart: dayView.viewDate})">
          <b>{{ dayView.viewDate | calendarDate:'weekViewColumnHeader':locale }}</b><br>
          <span>{{ dayView.viewDate | calendarDate:'weekViewColumnSubHeader':locale }}</span>
        </div>
      </div>
      
      <div class="cal-day-view" #dayViewContainer>
        <template ngFor let-dayView [ngForOf]="view.views">
          <mwl-calendar-all-day-event
            *ngFor="let allDayEvent of dayView.allDayEvents"
            [style.marginLeft.px]="dayView.numberOfDaysFromViewDate * dayWidth + 70"
            [style.maxWidth.px]="allDayEvent.width"
            style="display: block;"
            [event]="allDayEvent"
            (eventClicked)="eventClicked.emit({event: event})">
          </mwl-calendar-all-day-event>
        </template>
        
        <div class="cal-hour-rows">
          <div class="cal-events" *ngFor="let dayView of view.views">
            <div
              #eventContainer
              *ngFor="let dayEvent of dayView?.events"
              mwlResizable
              [resizeEdges]="{top: dayEvent.event?.resizable?.beforeStart, bottom: dayEvent.event?.resizable?.afterEnd}"
              [resizeSnapGrid]="{top: eventSnapSize, bottom: eventSnapSize}"
              [validateResize]="validateResize"
              (resizeStart)="resizeStarted(dayEvent, $event, dayViewContainer)"
              (resizing)="resizing(dayEvent, $event)"
              (resizeEnd)="resizeEnded(dayEvent)"
              mwlDraggable
              [dragAxis]="{x: dayEvent.event.draggable && !currentResize, y: dayEvent.event.draggable && !currentResize}"
              [dragSnapGrid]="{x: eventSnapSize, y: eventSnapSize}"
              [validateDrag]="validateDrag"
              (dragStart)="dragStart(eventContainer, dayViewContainer)"
              (dragEnd)="eventDragged(dayEvent, $event)"
              class="cal-event"
              [style.marginTop.px]="dayEvent.top"
              [style.marginLeft.px]="dayEvent.left + 70"
              [style.height.px]="dayEvent.height - 15"
              [style.maxWidth.px]="dayEvent.width"
              [style.backgroundColor]="dayEvent.event.color.secondary"
              [style.borderColor]="dayEvent.event.color.primary"
              [class.cal-starts-within-day]="!dayEvent.startsBeforeDay"
              [class.cal-ends-within-day]="!dayEvent.endsAfterDay"
              [class.cal-draggable]="dayEvent.event.draggable"
              [ngClass]="dayEvent.event.cssClass"
              [mwlCalendarTooltip]="dayEvent.event.title | calendarEventTitle:'dayTooltip':dayEvent.event"
              [tooltipPlacement]="tooltipPlacement">
              <mwl-calendar-event-title
                [event]="dayEvent.event"
                view="day"
                (click)="eventClicked.emit({event: dayEvent.event})">
              </mwl-calendar-event-title>
              <mwl-calendar-event-actions [event]="dayEvent.event"></mwl-calendar-event-actions>
            </div>
          </div>
          
          <div class="cal-hour" *ngFor="let hour of hours" [style.minWidth.px]="dayView?.width + 70">
            <mwl-calendar-day-view-hour-segment
              *ngFor="let segment of hour.segments"
              [segment]="segment"
              [locale]="locale"
              (click)="hourSegmentClicked.emit({date: segment.date})"
              [class.cal-drag-over]="segment.dragOver"
              mwlDroppable
              (dragEnter)="segment.dragOver = true"
              (dragLeave)="segment.dragOver = false"
              (drop)="segment.dragOver = false; eventDropped($event, segment)">
            </mwl-calendar-day-view-hour-segment>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CalendarMultipleDayViewComponent implements OnChanges, OnInit, OnDestroy {

  @ViewChild('dayViewContainer') dayViewContainer: ElementRef;

  private dayWidth: number;

  /**
   * The current view date
   */
  @Input() numberOfDays: number = 7;

  /**
   * The current view date
   */
  @Input() viewDate: Date;

  /**
   * An array of events to display on view
   */
  @Input() events: CalendarEvent[] = [];

  /**
   * The number of segments in an hour. Must be <= 6
   */
  @Input() hourSegments: number = 2;

  /**
   * The day start hours in 24 hour time. Must be 0-23
   */
  @Input() dayStartHour: number = 0;

  /**
   * The day start minutes. Must be 0-59
   */
  @Input() dayStartMinute: number = 0;

  /**
   * The day end hours in 24 hour time. Must be 0-23
   */
  @Input() dayEndHour: number = 23;

  /**
   * The day end minutes. Must be 0-59
   */
  @Input() dayEndMinute: number = 59;

  /**
   * The width in pixels of each event on the view
   */
  @Input() eventWidth: number = 100;

  /**
   * An observable that when emitted on will re-render the current view
   */
  @Input() refresh: Subject<any>;

  /**
   * The locale used to format dates
   */
  @Input() locale: string;

  /**
   * A function that will be called before each hour segment is called. The first argument will contain the hour segment.
   * If you add the `cssClass` property to the segment it will add that class to the hour segment in the template
   */
  @Input() hourSegmentModifier: Function;

  /**
   * The grid size to snap resizing and dragging of events to
   */
  @Input() eventSnapSize: number = 30;

  /**
   * The placement of the event tooltip
   */
  @Input() tooltipPlacement: string = 'top';

  /**
   * Called when an event title is clicked
   */
  @Output() eventClicked: EventEmitter<{event: CalendarEvent}> = new EventEmitter<{event: CalendarEvent}>();

  /**
   * Called when an hour segment is clicked
   */
  @Output() hourSegmentClicked: EventEmitter<{date: Date}> = new EventEmitter<{date: Date}>();

  /**
   * Called when an event is resized or dragged and dropped
   */
  @Output() eventTimesChanged: EventEmitter<CalendarEventTimesChangedEvent> = new EventEmitter<CalendarEventTimesChangedEvent>();

  /**
   * @hidden
   */
  hours: DayViewHour[] = [];

  /**
   * @hidden
   */
  view: MultipleDayView;

  /**
   * @hidden
   */
  width: number = 0;

  /**
   * @hidden
   */
  refreshSubscription: Subscription;

  /**
   * @hidden
   */
  currentResize: {
    originalTop: number,
    originalHeight: number,
    edge: string
  };

  /**
   * @hidden
   */
  validateDrag: Function;

  /**
   * @hidden
   */
  validateResize: Function;

  /**
   * @hidden
   */
  constructor(private cdr: ChangeDetectorRef, @Inject(LOCALE_ID) locale: string) {
    this.locale = locale;
  }

  /**
   * @hidden
   */
  ngOnInit(): void {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
        this.cdr.markForCheck();
      });
    }
  }

  /**
   * @hidden
   */
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /**
   * @hidden
   */
  ngOnChanges(changes: any): void {

    if (
      changes.viewDate ||
      changes.dayStartHour ||
      changes.dayStartMinute ||
      changes.dayEndHour ||
      changes.dayEndMinute
    ) {
      this.refreshHourGrid();
    }

    if (
      changes.viewDate ||
      changes.events ||
      changes.numberOfDays ||
      changes.dayStartHour ||
      changes.dayStartMinute ||
      changes.dayEndHour ||
      changes.dayEndMinute ||
      changes.eventWidth
    ) {
      this.refreshView();
    }

  }

  eventDropped(dropEvent: {dropData?: {event?: CalendarEvent}}, segment: DayViewHourSegment): void {
    if (dropEvent.dropData && dropEvent.dropData.event) {
      this.eventTimesChanged.emit({event: dropEvent.dropData.event, newStart: segment.date});
    }
  }

  resizeStarted(event: DayViewEvent, resizeEvent: ResizeEvent, dayViewContainer: any): void {
    this.currentResize = {
      originalTop: event.top,
      originalHeight: event.height,
      edge: typeof resizeEvent.edges.top !== 'undefined' ? 'top' : 'bottom'
    };
    const resizeHelper: CalendarResizeHelper = new CalendarResizeHelper(dayViewContainer);
    this.validateResize = ({rectangle}) => resizeHelper.validateResize({rectangle});
    this.cdr.markForCheck();
  }

  resizing(event: DayViewEvent, resizeEvent: ResizeEvent): void {
    if (resizeEvent.edges.top) {
      event.top = this.currentResize.originalTop + +resizeEvent.edges.top;
      event.height = this.currentResize.originalHeight - +resizeEvent.edges.top;
    } else if (resizeEvent.edges.bottom) {
      event.height = this.currentResize.originalHeight + +resizeEvent.edges.bottom;
    }
  }

  resizeEnded(dayEvent: DayViewEvent): void {
    let segments: number;
    if (this.currentResize.edge === 'top') {
      segments = (dayEvent.top - this.currentResize.originalTop) / this.eventSnapSize;
    } else {
      segments = (dayEvent.height - this.currentResize.originalHeight) / this.eventSnapSize;
    }

    dayEvent.top = this.currentResize.originalTop;
    dayEvent.height = this.currentResize.originalHeight;

    const segmentAmountInMinutes: number = 60 / this.hourSegments;
    const minutesMoved: number = segments * segmentAmountInMinutes;
    let newStart: Date = dayEvent.event.start;
    let newEnd: Date = dayEvent.event.end;
    if (this.currentResize.edge === 'top') {
      newStart = addMinutes(newStart, minutesMoved);
    } else if (newEnd) {
      newEnd = addMinutes(newEnd, minutesMoved);
    }

    this.eventTimesChanged.emit({newStart, newEnd, event: dayEvent.event});
    this.currentResize = null;

  }

  dragStart(eventElement: any, dayViewContainer: any): void {
    const dragHelper: CalendarDragHelper = new CalendarDragHelper(dayViewContainer, eventElement);
    this.validateDrag = ({x, y}) => !this.currentResize && dragHelper.validateDrag({x, y});
    this.cdr.markForCheck();
  }

  eventDragged(dayEvent: DayViewEvent, event: any): void {
    let newStart: Date = dayEvent.event.start;
    let newEnd: Date = dayEvent.event.end;

    const days: number = event.x / this.dayWidth;
    if (Math.abs(days) > .42) {
      const hoursMoved: number = 24 * Math.floor(days);
      newStart = addHours(newStart, hoursMoved);
      if (newEnd) {
        newEnd = addHours(newEnd, hoursMoved);
      }
    }

    const segments: number = event.y / this.eventSnapSize;
    const segmentAmountInMinutes: number = 60 / this.hourSegments;
    const minutesMoved: number = segments * segmentAmountInMinutes;
    newStart = addMinutes(newStart, minutesMoved);
    if (newEnd) {
      newEnd = addMinutes(newEnd, minutesMoved);
    }
    this.eventTimesChanged.emit({newStart, newEnd, event: dayEvent.event});
  }

  private refreshHourGrid(): void {
    this.hours = getDayViewHourGrid({
      viewDate: this.viewDate,
      hourSegments: this.hourSegments,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute
      }
    });
    if (this.hourSegmentModifier) {
      this.hours.forEach(hour => {
        hour.segments.forEach(segment => this.hourSegmentModifier(segment));
      });
    }
  }

  private refreshView(): void {
    this.dayWidth = (this.dayViewContainer.nativeElement.clientWidth - 70) / this.numberOfDays;

    this.view = getMultipleDayView({
      events: this.events,
      viewDate: this.viewDate,
      numberOfDays: this.numberOfDays,
      hourSegments: this.hourSegments,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute
      },
      dayWidth: this.dayWidth,
      eventWidth: this.eventWidth,
      segmentHeight: SEGMENT_HEIGHT
    });
  }

  private refreshAll(): void {
    this.refreshHourGrid();
    this.refreshView();
  }

}
