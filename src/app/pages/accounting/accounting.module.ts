import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AccountingRoutingModule } from "./accounting-routing.module";
import { ExpenseResultComponent } from "./components/expense-result/expense-result.component";
import { ExpenseSearchFormComponent } from "./components/expense-search-form/expense-search-form.component";
import { AccountingComponent } from "./containers/accounting/accounting.component";
import { ExpenseComponent } from "./containers/expense/expense.component";
import { ExpenseService } from "./services/expense.service";

@NgModule({
    declarations: [
        AccountingComponent, 
        ExpenseComponent, 
        ExpenseSearchFormComponent,
        ExpenseResultComponent
    ],
    providers: [ExpenseService],
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        AccountingRoutingModule,
    ]
})
export class AccountingModule { }
