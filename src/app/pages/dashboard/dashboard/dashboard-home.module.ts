import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CardModule } from "src/app/shared/components/card/card.module";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardComponent } from "./containers/dashboard/dashboard.component";
import { DashboardService } from "./services/dashboard.service";

@NgModule({
    declarations: [
        DashboardComponent
    ],
    providers: [DashboardService],
    imports: [
        CommonModule, 
        SharedModule,
        CardModule
    ]
})
export class DashboardHomeModule {}