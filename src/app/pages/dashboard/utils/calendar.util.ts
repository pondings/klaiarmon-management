import { Timestamp } from "firebase/firestore";
import { map, Observable, OperatorFunction } from "rxjs";
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

export const mapToEditable: OperatorFunction<CalendarEventDto[], CalendarEventDto[]> = (target$) =>
    target$.pipe(map(target => target.map(t => ({ ...t, meta: { ...t.meta, editable: true } }))));

export const mapDtoListToEvents: OperatorFunction<CalendarEventDto[], CalendarEventWithMeta[]> = ($dtoList: Observable<CalendarEventDto[]>) => 
    $dtoList.pipe(map(dtoList => dtoList.map(mapDtoToEvent)));
    
export const mapDtoToEvent = (dto: CalendarEventDto): CalendarEventWithMeta => ({ ...dto, start: dto.start.toDate(), end: dto.end?.toDate() });

export function filterEventsDocIdNotEqual(docId: string) {
    return (event: CalendarEventWithMeta) => event.meta?.documentId !== docId;
}
