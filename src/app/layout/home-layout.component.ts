import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'app-home-layout',
    template: `
        <app-header></app-header>
    
        <div class="headingWrapper color-bright">
            <a href="#" class="header header--pushDown header--shadow">Please wait for the content :)</a>
        </div>
        <router-outlet></router-outlet>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeLayoutComponent { }
