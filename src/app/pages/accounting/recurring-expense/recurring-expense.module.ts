import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RecurringExpenseModalComponent } from "./components/recurring-expense-modal/recurring-expense-modal.component";
import { RecurringExpenseComponet } from "./containers/recurring-expense/recurring-expense.component";
import { RecurringExpenseService } from "./services/recurring-expense.service";

@NgModule({
    declarations: [
        RecurringExpenseComponet,
        RecurringExpenseModalComponent
    ],
    providers: [RecurringExpenseService],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class RecurringExpenseModule {}
