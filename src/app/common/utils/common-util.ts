export const isArray = (target: any): boolean => target instanceof Array;
export const isObject = (target: any): boolean => typeof target === 'object';
export const isUndefined = (target: any): boolean => target === undefined;
export const isContainProperty = (target: any, property: string): boolean => property in target;

export const isNotUndefined = (target: any): boolean => !isUndefined(target);
export const isNotNull = (target: any): boolean => target != null;
export const isNotNullOrUndefined = (target: any): boolean => isNotNull(target) && isNotUndefined(target);

export const removeArrDuplicated = <T>(record: T, idx: number, self: T[]) => self.indexOf(record) === idx;
export const mergeArray = <T>(prev: T[], cur: T[]): T[] => prev.concat(cur);
export const stringFormat = (str: string, ...args: string[]) => str.replace(/{(\d+)}/g, (match, index) => args[index] || '');

export function mapTo<T, K extends keyof T>(prop: K): (record: T) => T[K] {
    return record => record[prop];
}
