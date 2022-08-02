import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'app-home-layout',
    template: `
        <app-header></app-header>
        <router-outlet></router-outlet>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeLayoutComponent { }
