import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Moment } from "moment";
import { BaseChartDirective } from "ng2-charts";
import { combineLatest, forkJoin, merge, Observable } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";
import { UserBillingInfo } from "../../model/user-billing-info.model";

enum ChartMode {
    BY_USER = 'By User',
    BY_EXPENSE = 'By Expense'
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

    @ViewChild(BaseChartDirective, { static: true })
    chart!: BaseChartDirective;

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

    constructor(private usernamePipe: UsernamePipe) { }

    ngOnInit(): void {
        this.subscribeUserBillingInfosAndChartMode();
        this.monthOptions = this.getMonthOptions();
        this.periodCtrl.valueChanges.subscribe(val => this.periodChange.emit(val!));
        this.chartModeCtrl.setValue(ChartMode.BY_USER);
    }

    private getMonthOptions(): Moment[] {
        const backMonths = 7;
        const months = Array.from(Array(backMonths).keys()).map(num => getMoment()?.startOf('month').subtract(num, 'month')!);
        this.periodCtrl.setValue(months[0]);
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
        });
    }

}
