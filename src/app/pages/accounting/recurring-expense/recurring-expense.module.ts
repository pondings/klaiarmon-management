import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RecurringExpenseComponet } from "./containers/recurring-expense/recurring-expense.component";

@NgModule({
    declarations: [RecurringExpenseComponet],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class RecurringExpenseModule {}
