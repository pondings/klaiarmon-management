import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TimeUnit } from "src/app/shared/model/time-unit";
import { Dateable, getMoment, getMomentStartOfDay } from "./moment.util";

export type NullableDate = Date | null | undefined;

export const getDateStartOfDay = (date?: Dateable): NullableDate => getMomentStartOfDay(date)?.toDate()!;
export const getDate = (date?: Dateable): NullableDate => getMoment(date)?.toDate()!;
export const getDateFromDateStruct = (date: NgbDateStruct): NullableDate => 
    date ? new Date(date.year, date.month === 12 ? date.month - 1 : date.month, date.day) : null;

export const addDate = (date: Dateable, amount: number, unit: TimeUnit): NullableDate => getMoment(date)?.add(amount, unit).toDate()!;

export const parseDate = (date: string, format?: string): NullableDate => getMoment(date, format)?.toDate()!;
