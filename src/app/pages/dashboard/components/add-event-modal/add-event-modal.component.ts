import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-add-event-modal',
    templateUrl: './add-event-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AddEventModalComponent {

    @Input('myEvent')
    myEvent: any;


}
