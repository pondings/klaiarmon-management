import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { getMoment } from "./moment.util";

export type NullableDateStruct = NgbDateStruct | null | undefined;

export const getDateStruct = (): NullableDateStruct => {
    let { date: day, months: month, years: year } = getMoment()?.toObject()!;
    month = month + 1;
    return { day, month, year };
};

export const getDateStructFromDate = (date?: Date): NullableDateStruct => {
    if (!date) return null;

    let { date: day, months: month, years: year } = getMoment(date)?.toObject()!;
    month = month + 1;
    return { day, month, year };
}
