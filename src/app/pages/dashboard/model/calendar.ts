import { FormControl } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CalendarMonthViewDay } from "angular-calendar";
import { Timestamp } from "firebase/firestore";
import { MetaData } from "src/app/model/meta-data";
import { Nullable } from 'src/app/common/types/common.type';

export type CalendarDayEvent = { day: CalendarMonthViewDay<MetaData>; sourceEvent: MouseEvent | KeyboardEvent; };

export interface CalendarEventDto {
    title: string;
    start: Timestamp;
    end?: Timestamp;
    allDay: boolean;
    meta: MetaData;
}

export interface AddCalendarEventForm {
    title: FormControl<Nullable<string>>,
    start: FormControl<Nullable<NgbDateStruct>>,
    end: FormControl<Nullable<NgbDateStruct>>
}
