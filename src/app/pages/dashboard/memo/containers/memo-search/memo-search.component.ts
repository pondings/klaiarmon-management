import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-memo-search',
    templateUrl: './memo-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MemoSearchComponent {

    faAdd = faAdd;

    constructor(private router: Router) {}

    createMemo(): void {
        this.router.navigate(['dashboard', 'memo', 'edit']);
    }

}
