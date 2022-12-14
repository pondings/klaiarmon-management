import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CalendarEventWithMeta } from "../../models/calendar";

@Component({
    selector: 'app-event-info',
    templateUrl: './event-info.component.html',
    styleUrls: ['./event-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EventInfoComponent {

    @Input()
    event!: CalendarEventWithMeta;

    @Output()
    onDelete = new EventEmitter<CalendarEventWithMeta>();

    @Output()
    onEdit = new EventEmitter<CalendarEventWithMeta>;

    faPen = faPen;
    faTrash = faTrash;

    isCollapsed = true;

    deleteEvent(): void {
        this.onDelete.emit(this.event);
    }

    editEvent(): void {
        this.onEdit.emit(this.event);
    }

    getDirectionLink(): string {
        const placeId = this.event.meta?.place?.placeId;
        return `https://www.google.com/maps/dir/?api=1&destination=${placeId}&destination_place_id=${placeId}&travelmode=driving`;
    }

}
