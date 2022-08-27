import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-memo-search',
    templateUrl: './memo-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MemoSearchComponent {

    faAdd = faAdd;

}
