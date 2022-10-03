import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-home-layout',
    template: `
        <app-header></app-header>
        <app-toast></app-toast>
        <div class="overflow-auto overflow-container pt-2">
            <div class="container">
                <router-outlet></router-outlet>
            </div>
        </div>
        <app-sidebar></app-sidebar>
    `,
    styleUrls: ['./home-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HomeLayoutComponent {}
