import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { BehaviorSubject, map, merge, Observable, OperatorFunction, Subject, switchMap } from "rxjs";

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DropdownComponent<T = string> implements OnInit {

    @Input('control')
    control!: FormControl; 

    @Input()
    label!: string;

    @Input()
    required!: boolean;

    @Input()
    disabled!: boolean;

    @Input()
    values!: T[];

    @Input()
    formatterFn: (result: T) => string = (result: T) => result as any;

    values$ = new BehaviorSubject<T[]>([]);
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    faXmark = faXmark;

    async ngOnInit(): Promise<void> {
        this.values$.next(this.values);
    }

    searchValues: OperatorFunction<string, readonly T[]> = (text$: Observable<string>) =>
        merge(this.focus$, this.click$, text$).pipe(switchMap(_ => this.values$))

    clearSelectedValue(): void {
        this.control.reset();
        this.control.enable();
    }

}
