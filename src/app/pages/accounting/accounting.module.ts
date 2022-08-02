import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AccountingRoutingModule } from "./accounting-routing.module";
import { AccountingComponent } from "./accounting.component";

@NgModule({
    declarations: [AccountingComponent],
    imports: [CommonModule, AccountingRoutingModule]
})
export class AccountingModule { }
