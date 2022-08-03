import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { SidebarService } from "../sidebar/sidebar.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

    constructor(public sidebarService: SidebarService) { }

}
