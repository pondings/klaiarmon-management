import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Injectable()
export class CustomDateFormatter extends NgbDateParserFormatter {

    parse(value: string): NgbDateStruct {
        return null!;
    }

    format(date: NgbDateStruct): string {
        if (!date) return null!;
        return moment({ date: date.day, month: date.month - 1, year: date.year }).format('DD/MM/YYYY');
    }

}
