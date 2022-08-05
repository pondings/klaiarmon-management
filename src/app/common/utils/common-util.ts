export const isArray = (target: any): boolean => target instanceof Array;
export const isObject = (target: any): boolean => typeof target === 'object';
export const isUndefined = (target: any): boolean => target === undefined;
export const isContainProperty = (target: any, property: string): boolean => property in target;

export const isNotUndefined = (target: any): boolean => !isUndefined(target);
export const isNotNull = (target: any): boolean => target != null;
export const isNotNullOrUndefined = (target: any): boolean => isNotNull(target) && isNotUndefined(target);
