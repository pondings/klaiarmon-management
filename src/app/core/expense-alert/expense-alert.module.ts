import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ExpenseModule } from "src/app/pages/accounting/expense/expense.module";
import { ExpenseAlertService } from "./expense-alert.service";

@NgModule({
    providers: [ExpenseAlertService],
    imports: [
        CommonModule,
        ExpenseModule
    ]
})
export class ExpenseAlertModule {}
