import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-home-layout',
    template: `
        <app-header></app-header>
        <div class="container">
            <router-outlet></router-outlet>
        </div>
        <app-sidebar></app-sidebar>
    `,
    styles: [
        'app-home-layout { height: 100%; width: 100%; display: flex; flex-direction: column; }',
        '.container { flex-grow: 1; display: flex; flex-direction: column; }'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HomeLayoutComponent { }
