import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Moment } from "moment";
import { BaseChartDirective } from "ng2-charts";
import { Observable } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";
import { UserBillingInfo } from "../../model/user-billing-info.model";

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

    periodCtrl = new FormControl<Moment | undefined>({ value: undefined, disabled: false });

    constructor(private usernamePipe: UsernamePipe) { }

    ngOnInit(): void {
        this.subscribeUserBillingInfos();
        this.monthOptions = this.getMonthOptions();
        this.periodCtrl.valueChanges.subscribe(val => this.periodChange.emit(val!));
    }

    private getMonthOptions(): Moment[] {
        const backMonths = 7;
        const months = Array.from(Array(backMonths).keys()).map(num => getMoment()?.startOf('month').subtract(num, 'month')!);
        this.periodCtrl.setValue(months[0]);
        return months;
    }

    private async subscribeUserBillingInfos(): Promise<void> {
        this.userBillingInfos$.subscribe(async userBillings => {
            await Promise.all(userBillings.map<void>(async userBilling => {
                this.chartData.labels?.push(await this.usernamePipe.transform(userBilling.user)); 
                this.chartData.datasets.at(0)?.data.push(userBilling.expenseAmount); 
            }));
            this.chart.update();
        })
    }

}
