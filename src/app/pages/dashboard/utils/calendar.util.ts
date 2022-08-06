import { Timestamp } from "firebase/firestore";
import { CalendarEventDto, CalendarEventWithMeta } from "../model/calendar";

export const mapToEditable = (events: CalendarEventDto[]): CalendarEventDto[] => events.map(event => { event.meta.editable = true; return event });

export const mapToUneditable = (events: CalendarEventDto[]): CalendarEventDto[] => events.map(event => { event.meta.editable = false; return event });

export const mapCalendarEventToDto = (calendarEvent: CalendarEventWithMeta): CalendarEventDto => {
    const { title, start, end, meta } = calendarEvent;
    return {
        title,
        start: Timestamp.fromDate(start),
        end: (end ? Timestamp.fromDate(end) : null)!,
        meta: meta || {},
        allDay: true
    };
}

export const mapCalendarDtoToEvents = (events: CalendarEventDto[]): CalendarEventWithMeta[] => {
    return events.map(event => ({
        ...event,
        start: event.start?.toDate(),
        end: event.end?.toDate()
    }));
}
