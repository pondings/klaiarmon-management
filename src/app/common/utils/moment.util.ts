import * as moment from 'moment';
import { TimeUnit } from 'src/app/shared/model/time-unit';

export type Dateable = Date | string | moment.MomentInputObject | null | undefined;
export type NullableMoment = moment.Moment | null | undefined;

export const getMoment = (date?: Dateable, format?: string): NullableMoment => moment(date, format);
export const getMomentStartOfDay = (date?: Dateable): NullableMoment => getMoment(date)?.startOf(TimeUnit.day)!;
export const addDate = (date: Dateable, amount: number, TimeUnit: TimeUnit): NullableMoment => getMoment(date)?.add(amount, TimeUnit);
