import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { addDate, getMoment, getMomentStartOfDay } from "./moment.util";

export type NullableDateStruct = NgbDateStruct | null | undefined;

export const getDateStruct = (): NullableDateStruct => {
    const { date: day, months: month, years: year } = addDate(null, 1, TimeUnit.month)?.toObject()!;
    return { day, month, year };
};

export const getDateStructFromDate = (date?: Date): NullableDateStruct => {
    if (!date) return null;

    const { date: day, months: month, years: year } = addDate(date, 1, TimeUnit.month)?.toObject()!;
    return { day, month, year };
}
