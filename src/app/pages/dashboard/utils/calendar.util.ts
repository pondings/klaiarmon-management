import { Timestamp } from "firebase/firestore";
import { CalendarEventDto, CalendarEventWithMeta } from "../model/calendar";

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

export const mapToEditable: (eventDto: CalendarEventDto) => CalendarEventDto = (eventDto) => 
    ({ ...eventDto, meta: { ...eventDto.meta, editable: false } });

export const mapCalendarDtoToEvent: (eventDto: CalendarEventDto) => CalendarEventWithMeta = eventDto => 
    ({ ...eventDto, start: eventDto.start.toDate(), end: eventDto.end?.toDate() });

export function filterEventsDocIdNotEqual(docId: string) {
    return (event: CalendarEventWithMeta) => event.meta?.documentId !== docId;
}
