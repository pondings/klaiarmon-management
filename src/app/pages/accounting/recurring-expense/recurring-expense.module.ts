import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CardModule } from "src/app/shared/components/card/card.module";
import { DropdownModule } from "src/app/shared/components/dropdown/dropdown.module";
import { UserSelectorModule } from "src/app/shared/components/user-selector/user-selector.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ExpenseModule } from "../expense/expense.module";
import { RecurringExpenseModalComponent } from "./components/recurring-expense-modal/recurring-expense-modal.component";
import { RecurringExpenseResultComponent } from "./components/recurring-expense-result/recurring-expense-result.component";
import { RecurringExpenseSearchFormComponent } from "./components/recurring-expense-search-form/recurring-expense-search-form.component";
import { RecurringExpenseComponet } from "./containers/recurring-expense/recurring-expense.component";
import { RecurringExpenseCreationService } from "./services/recurring-expense-creation.service";
import { RecurringExpenseDeletationService } from "./services/recurring-expense-deletation.service";
import { RecurringExpenseSearchService } from "./services/recurring-expense-search.service";
import { RecurringExpenseService } from "./services/recurring-expense.service";

@NgModule({
    declarations: [
        RecurringExpenseComponet,
        RecurringExpenseModalComponent,
        RecurringExpenseSearchFormComponent,
        RecurringExpenseResultComponent,
    ],
    providers: [
        RecurringExpenseService,
        RecurringExpenseCreationService,
        RecurringExpenseSearchService,
        RecurringExpenseDeletationService
    ],
    imports: [
        CommonModule,
        SharedModule,
        UserSelectorModule,
        ExpenseModule,
        DropdownModule,
        CardModule
    ]
})
export class RecurringExpenseModule {}
