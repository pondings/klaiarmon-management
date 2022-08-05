import { FormControl } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CalendarMonthViewDay } from "angular-calendar";
import { Timestamp } from "firebase/firestore";
import { MetaData } from "src/app/model/meta-data";

export type CalendarDayEvent = { day: CalendarMonthViewDay<MetaData>; sourceEvent: MouseEvent | KeyboardEvent; };

export interface CalendarEventDto {
    title: string;
    start: string;
    end?: string;
    allDay: boolean;
    meta: MetaData;
}

export interface AddCalendarEventForm {
    title: FormControl<string | null>,
    start: FormControl<NgbDateStruct | null>,
    end: FormControl<NgbDateStruct | null>
}
