import { CalendarEvent, DayView, getDayView } from 'calendar-utils';
/*tslint:disable*/
import { setMinutes, setHours, startOfMinute, startOfDay, endOfDay, areRangesOverlapping, isSameSecond, addDays, differenceInMinutes, getDay, isSameDay } from 'date-fns';

const WEEKEND_DAY_NUMBERS = [0, 6];

export interface GetDayViewArgs {
  events?: CalendarEvent[];
  viewDate: Date;
  hourSegments: number;
  dayStart: {
    hour: number;
    minute: number;
  };
  dayEnd: {
    hour: number;
    minute: number;
  };
  eventWidth: number;
  segmentHeight: number;
}

export interface SingleDayView extends DayView {
  viewDate: Date;
}

export interface GetMultipleDayViewArgs extends GetDayViewArgs {
  numberOfDays: number;
  dayWidth: number;
}

export interface MultipleDayView {
  views: SingleDayView[];
  allDayEvents: CalendarEvent[];
}

export function getMultipleDayView(multipleDayViewArgs: GetMultipleDayViewArgs): MultipleDayView {
  const today = new Date();
  const {events = [], viewDate, numberOfDays, dayWidth, eventWidth } = multipleDayViewArgs;
  const multipleDayView: MultipleDayView = {
    views: [],
    allDayEvents: []
  };
  for (let _numberOfDays = 0; _numberOfDays < numberOfDays; _numberOfDays++) {
    const args = Object.assign({}, multipleDayViewArgs, {events, eventWidth, viewDate: addDays(viewDate, _numberOfDays)});
    const singleDayView = <SingleDayView>Object.assign(getDayView(args), {
      viewDate: args.viewDate,
      isPast: args.viewDate < today,
      isToday: isSameDay(args.viewDate, today),
      isFuture: args.viewDate > today,
      isWeekend: WEEKEND_DAY_NUMBERS.indexOf(getDay(args.viewDate)) > -1
    });
    multipleDayView.views.push(singleDayView);
  }
  multipleDayView.views.forEach((view, viewIndex) => {
    view.events.forEach(event => {
      const overlappingEvents = view.events.filter(
        otherEvent => areRangesOverlapping(event.event.start, event.event.end, otherEvent.event.start, otherEvent.event.end));
      event.left = (event.left / overlappingEvents.length) + (dayWidth * viewIndex);
      event.width = dayWidth / overlappingEvents.length;
    });
  });
  return multipleDayView;
}
