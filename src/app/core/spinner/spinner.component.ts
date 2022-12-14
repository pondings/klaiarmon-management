import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent {}
