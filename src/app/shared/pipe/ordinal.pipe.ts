import { Pipe, PipeTransform } from "@angular/core";
import ordinal from 'ordinal';

@Pipe({ name: 'ordinal' })
export class OrdinalPipe implements PipeTransform {

    transform(target: number): string {
        return ordinal(target);
    }

}
