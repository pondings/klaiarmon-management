import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { SidebarService } from "../sidebar/sidebar.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

    faBars = faBars;

    constructor(public sidebarService: SidebarService) { }

}
