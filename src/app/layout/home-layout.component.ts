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
    styles: [
        'app-home-layout .overflow-container { height: 100% !important; }',
        'app-home-layout { height: 100% !important; width: 100% !important; display: flex !important; flex-direction: column !important; }',
        'app-home-layout { .container { flex-grow: 1; display: flex; flex-direction: column; height: 100%; } }'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HomeLayoutComponent {}
