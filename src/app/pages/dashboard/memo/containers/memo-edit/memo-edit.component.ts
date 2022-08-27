import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { Route, Router } from "@angular/router";
import { faChevronLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-memo-edit',
    templateUrl: './memo-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MemoEditComponent {

    faChevronLeft = faChevronLeft;
    faFloppyDisk = faFloppyDisk;

    constructor(private router: Router) {}

    back() {
        this.router.navigate(['dashboard', 'memo']);
    }

}
