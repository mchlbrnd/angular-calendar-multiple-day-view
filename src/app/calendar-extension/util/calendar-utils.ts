import { CalendarEvent, DayView, getDayView } from 'calendar-utils';
import { setMinutes, setHours, startOfMinute, startOfDay, endOfDay, isSameSecond, addDays, differenceInMinutes } from 'date-fns';

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
  const {events = [], viewDate, numberOfDays, dayWidth } = multipleDayViewArgs;
  const view: MultipleDayView = {
    views: [],
    allDayEvents: []
  };
  for (let _numberOfDays = 0; _numberOfDays < numberOfDays; _numberOfDays++) {
    const _multipleDayViewArgs = Object.assign({}, multipleDayViewArgs, {events, viewDate: addDays(viewDate, _numberOfDays)});
    const singleDayView = <SingleDayView>Object.assign(
      getDayView(_multipleDayViewArgs), {
        viewDate: _multipleDayViewArgs.viewDate
      });
    view.views.push(singleDayView);
  }
  view.views.forEach((_view, viewIndex) => {
    _view.width = dayWidth;
    _view.events.forEach(event => event.left += dayWidth * viewIndex);
  });
  return view;
}
