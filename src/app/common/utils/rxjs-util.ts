import { map, MonoTypeOperatorFunction, Observable, OperatorFunction, take } from "rxjs";

export const mergeForkArrays: OperatorFunction<any[], any[]> = (target$: Observable<any[]>) => target$.pipe(map(arr => arr[0].concat(arr[1])));

export function takeOnce<T>(): OperatorFunction<T, T> {
    return target$ => target$.pipe(take(1));
}
