import { NullableNumber } from "../types/common.type";

type KeysWithValsOfType<T,V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P } & keyof T;

// Filter, Find
export const isArray = (target: any): boolean => target instanceof Array;
export const isObject = (target: any): boolean => typeof target === 'object';
export const isUndefined = (target: any): boolean => target === undefined;
export const isContainProperty = (target: any, property: string): boolean => property in target;
export const isNotUndefined = (target: any): boolean => !isUndefined(target);
export const isNotNull = (target: any): boolean => target != null;
export const isNotNullOrUndefined = (target: any): boolean => isNotNull(target) && isNotUndefined(target);
export const removeArrDuplicated = <T>(record: T, idx: number, self: T[]) => self.indexOf(record) === idx;
export const findArrDuplicated = <T>(record: T, idx: number, self: T[]) => self.indexOf(record) !== idx;
export const filterByEqual = <T, K extends keyof T>(prop: K, candicate: T[K]): (record: T) => boolean => 
    record => record[prop] === candicate;
export const filterByIgnoreCase = <T, K extends KeysWithValsOfType<T, string>>(key: K, candidate: string): (record: T) => boolean => 
    record => ((record[key] as any || '').toLowerCase() as string).includes(candidate.toLocaleLowerCase())

// Reduce
export const mergeArray = <T>(prev: T[], cur: T[]): T[] => prev.concat(cur);
export const sumNumber = (prev: NullableNumber, cur: NullableNumber): number => prev! + cur!;

// Map
export function mapTo<T, K extends keyof T>(prop: K): (record: T) => T[K] {
    return record => record[prop];
}

export const stringFormat = (str: string, ...args: string[]) => str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
