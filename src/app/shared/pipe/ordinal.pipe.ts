import { Pipe, PipeTransform } from "@angular/core";
import { indicator } from 'ordinal';

@Pipe({ name: 'ordinal' })
export class OrdinalPipe implements PipeTransform {

    transform(target: number): string {
        return `${target}${indicator(target)}`;
    }

}
