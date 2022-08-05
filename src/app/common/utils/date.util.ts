import { TimeUnit } from "src/app/shared/model/time-unit";
import { Dateable, getMoment, getMomentStartOfDay } from "./moment.util";

export type NullableDate = Date | null | undefined;

export const getDateStartOfDay = (date?: Dateable): NullableDate => getMomentStartOfDay(date)?.toDate()!;
export const getDate = (date?: Dateable): NullableDate => getMoment(date)?.toDate()!;

export const addDate = (date: Dateable, amount: number, unit: TimeUnit): NullableDate => getMoment(date)?.add(amount, unit).toDate()!;

export const parseDate = (date: string, format?: string): NullableDate => getMoment(date, format)?.toDate()!;
