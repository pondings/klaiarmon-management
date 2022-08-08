import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'app-auth-layout',
    template: `
        <router-outlet></router-outlet>
        <app-toast></app-toast>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {

}
