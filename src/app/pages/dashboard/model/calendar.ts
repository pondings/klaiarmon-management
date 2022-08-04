import { FormBuilder, FormControl } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CalendarMonthViewDay } from "angular-calendar";

export type CalendarDayEvent = { day: CalendarMonthViewDay<EventCreatedBy>; sourceEvent: MouseEvent | KeyboardEvent; };

export interface CalendarEventDto {
    title: string;
    start: string;
    allDay: boolean;
    meta?: EventCreatedBy;
}

export interface EventCreatedBy {
    createdBy: string;
    createdDate: Date;
}

export interface AddCalendarEventForm {
    title: FormControl<string | null>,
    start: FormControl<NgbDateStruct | null>,
    end: FormControl<NgbDateStruct | null>
}
