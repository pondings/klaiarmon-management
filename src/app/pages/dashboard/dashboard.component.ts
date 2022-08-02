import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-dashboard',
    template: `
    <div class="headingWrapper color-bright">
        <a href="#" class="header header--pushDown header--shadow">Please wait for the content :)</a>
    </div>
    `,
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent { }
