import { AngularCalendarWeekDayViewPage } from './app.po';

describe('angular-calendar-week-day-view App', () => {
  let page: AngularCalendarWeekDayViewPage;

  beforeEach(() => {
    page = new AngularCalendarWeekDayViewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
