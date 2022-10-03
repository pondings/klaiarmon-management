import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'default' })
export class DefaultValuePipe implements PipeTransform {

    transform(target: any, defaultValue: string): string {
        return [0, '0', null, undefined].includes(target) ? defaultValue : target;
    }

}
