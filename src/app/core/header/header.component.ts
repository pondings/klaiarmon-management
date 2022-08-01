import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

}
