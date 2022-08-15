import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { map, merge, Observable, OperatorFunction, Subject, switchMap } from "rxjs";
import { FireAuthService, UserInfo } from "src/app/core/services/fire-auth.service";

@Component({
    selector: 'app-user-selector',
    templateUrl: './user-selector.component.html',
    styleUrls: ['./user-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class UserSelectorComponent implements OnInit {

    @Input('control')
    control!: FormControl; 

    @Input()
    label!: string;

    @Input()
    required!: boolean;

    users$!: Observable<UserInfo[]>;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    faXmark = faXmark;

    constructor(private fireAuthService: FireAuthService) {}

    ngOnInit(): void {
        this.users$ = this.fireAuthService.getAllUsers();
    }

    searchUsers: OperatorFunction<string, readonly UserInfo[]> = (text$: Observable<string>) =>
        merge(this.focus$, this.click$, text$).pipe(switchMap(text => this.users$.pipe(this.mapMatchingUsers(text))));

    searchUserFormatter(result: UserInfo): string {
        return result.displayName!;
    }

    clearSelectedUser(): void {
        this.control.reset();
        this.control.enable();
    }

    private mapMatchingUsers(candidate: string): OperatorFunction<UserInfo[], UserInfo[]> {
        return users$ => users$.pipe(map(users => users.filter(this.matchUserDisplayNameIgnoreCase(candidate))));
    }

    private matchUserDisplayNameIgnoreCase(candidate: string): (user: UserInfo) => boolean {
        return user => user.displayName?.toLowerCase().includes(candidate.toLowerCase())!;
    }

}
