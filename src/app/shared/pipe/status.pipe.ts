import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {

    transform(active: boolean): string {
        return active ? 'Active' : 'Inactive';
    }

}
