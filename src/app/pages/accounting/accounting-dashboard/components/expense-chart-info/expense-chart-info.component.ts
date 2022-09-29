import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Moment } from "moment";
import { BaseChartDirective } from "ng2-charts";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { mapTo, mergeArray } from "src/app/common/utils/common-util";
import { getMoment } from "src/app/common/utils/moment.util";
import { SpinnerService } from "src/app/core/spinner/spinner.service";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";
import { Expense } from "../../../expense/model/expense.model";
import { UserBillingInfo } from "../../model/user-billing-info.model";

enum ChartMode {
    BY_USER = 'By User',
    BY_EXPENSE = 'By Expense'
}

interface ChartViewData {
    title: string;
    data: number;
    mode: ChartMode
}

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-expense-chart-info',
    templateUrl: './expense-chart-info.component.html',
    styleUrls: ['expernse-chart-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ExpenseChartInfoComponent implements OnInit {

    @Input()
    userBillingInfos$!: Observable<UserBillingInfo[]>

    @Output()
    periodChange = new EventEmitter<Moment>();

    @Output()
    showBilling = new EventEmitter<UserBillingInfo>();

    @Output()
    viewExpesne = new EventEmitter<Expense>();

    @ViewChild(BaseChartDirective, { static: true })
    chart!: BaseChartDirective;

    billingInfo$ = new BehaviorSubject<UserBillingInfo[]>([]);

    chartType: ChartType = 'pie';
    chartOptions: ChartOptions<'pie'> = { responsive: true };
    chartData: ChartData<'pie', number[], string> = {
        labels: [],
        datasets: [{ data: [] }]
    };

    monthOptions: Moment[] = [];
    chartModeOptions: ChartMode[] = [ChartMode.BY_USER, ChartMode.BY_EXPENSE];

    periodCtrl = new FormControl<Moment | undefined>({ value: undefined, disabled: false });
    chartModeCtrl = new FormControl<ChartMode | undefined>({ value: undefined, disabled: false });

    viewData!: Partial<ChartViewData>;

    constructor(private usernamePipe: UsernamePipe,
        private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.subscribeUserBillingInfosAndChartMode();
        this.monthOptions = this.getMonthOptions();
        this.periodCtrl.valueChanges.subscribe(val => this.periodChange.emit(val!));
        this.chartModeCtrl.setValue(ChartMode.BY_USER);
    }

    async selectData(chartEvents: any[]): Promise<void> {
        if (!chartEvents[0]) {
            this.viewData = {};
            return;
        }

        const chartEvent = chartEvents[0];
        const dataset = this.chartData.datasets[chartEvent.datasetIndex!];

        const title = this.chartData.labels?.at(chartEvent.index!)!;
        const data = dataset.data[chartEvent.index!];
        const mode = this.chartModeCtrl.value!;

        this.viewData = { title, data, mode };
    }

    async showData(): Promise<void> {
        const { mode } = this.viewData;
        if (!this.viewData.mode) return;

        const billings = this.billingInfo$.getValue();

        if (mode === ChartMode.BY_USER) {
            await this.openShowUserExpenseDataModal(billings);
        } else if (mode === ChartMode.BY_EXPENSE) {
            await this.openShowExpenseInfoModal(billings);
        }
    }

    private async openShowUserExpenseDataModal(billings: UserBillingInfo[]): Promise<void> {
        const { title, data } = this.viewData;
        this.spinnerService.show();
        const usernamedBillings = await Promise.all(billings.map(this.mapBillingUsername()));
        const targetBilling = usernamedBillings.find(this.findBillingByTitleAndAmount(title!, data!));
        this.showBilling.emit(targetBilling);
        this.spinnerService.hide();
    }

    private async openShowExpenseInfoModal(billings: UserBillingInfo[]): Promise<void> {
        const { title, data } = this.viewData;
        const targetExpense = billings.map(mapTo('expenses')).reduce(mergeArray, []).find(this.findExpenseByTitleAndAmount(title!, data!));
        this.viewExpesne.emit(targetExpense);
    }

    private getMonthOptions(): Moment[] {
        const backMonths = 7;
        const months = Array.from(Array(backMonths).keys()).map(num => getMoment()?.startOf('month').subtract(num, 'month')!);
        this.periodCtrl.setValue(months[0]);

        months.unshift(getMoment()?.startOf('month').add(1, 'month')!);
        return months;
    }

    private async subscribeUserBillingInfosAndChartMode(): Promise<void> {
        combineLatest([this.userBillingInfos$, this.chartModeCtrl.valueChanges]).subscribe(async ([billingInfos, chartMode]) => {
            this.chartData.labels = [];
            this.chartData.datasets = [{ data: [] }];
            switch (chartMode) {
                case ChartMode.BY_EXPENSE:
                    const billingExpense = billingInfos.map(billing => billing.expenses).reduce((prev, cur) => prev.concat(cur), []);
                    billingExpense.forEach(billing => {
                        this.chartData.labels?.push(billing.name);
                        this.chartData.datasets.at(0)?.data.push(billing.amount);
                    });
                    break;
                case ChartMode.BY_USER:
                default:
                    await Promise.all(billingInfos.map(async billing => {
                        this.chartData.labels?.push(await this.usernamePipe.transform(billing.user));
                        this.chartData.datasets.at(0)?.data.push(billing.expenseAmount);
                    }));
                    break;
            }
            this.chart.update();
            this.billingInfo$.next(billingInfos);
        });
    }

    private mapBillingUsername(): (billing: UserBillingInfo) => Promise<UserBillingInfo> {
        return billing => new Promise(async (resolve) => {
            return resolve({ ...billing, user: await this.usernamePipe.transform(billing.user) });
        });
    }

    private findBillingByTitleAndAmount(title: string, amount: number): (billing: UserBillingInfo) => boolean {
        return billing => billing.user === title && billing.expenseAmount === amount;
    }

    private findExpenseByTitleAndAmount(title: string, amount: number): (expense: Expense) => boolean {
        return expense => expense.name === title && expense.amount === amount;
    }

}
