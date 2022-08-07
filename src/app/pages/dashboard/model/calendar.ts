import { FormControl } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CalendarEvent, CalendarMonthViewDay } from "angular-calendar";
import { Timestamp } from "firebase/firestore";
import { MetaData } from "src/app/model/meta-data";
import { Nullable } from 'src/app/common/types/common.type';

export type CalendarDayEvent = { day: CalendarMonthViewDay<CalendarMeta>; sourceEvent: MouseEvent | KeyboardEvent; };
export type CalendarMeta = MetaData & { editable?: boolean, description?: string }
export type CalendarEventWithMeta = CalendarEvent<CalendarMeta>;

export interface CalendarEventDto {
    title: string;
    start: Timestamp;
    end?: Timestamp;
    allDay: boolean;
    meta: CalendarMeta;
}

export interface AddCalendarEventForm {
    title: FormControl<Nullable<string>>,
    start: FormControl<Nullable<NgbDateStruct>>,
    end: FormControl<Nullable<NgbDateStruct>>,
    description: FormControl<Nullable<string>>
}
