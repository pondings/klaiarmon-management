import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UserSelectorModule } from "src/app/shared/components/user-selector/user-selector.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ExpenseModule } from "../expense/expense.module";
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
        SharedModule,
        UserSelectorModule,
        ExpenseModule
    ]
})
export class RecurringExpenseModule {}
