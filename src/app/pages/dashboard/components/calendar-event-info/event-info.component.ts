import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CalendarEvent } from "angular-calendar";
import { MetaData } from "src/app/model/meta-data";

@Component({
    selector: 'app-event-info',
    templateUrl: './event-info.component.html',
    styleUrls: ['./event-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EventInfoComponent {

    @Input()
    event!: CalendarEvent<MetaData>;

    @Output()
    onDelete = new EventEmitter<string>();

    faPen = faPen;
    faTrash = faTrash;

    isCollapsed = true;

    deleteEvent(): void {
        this.onDelete.emit(this.event.meta?.documentId);
    }

}
