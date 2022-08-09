import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { finalize, Observable, take } from "rxjs";
import { SpinnerService } from "src/app/core/spinner/spinner.service";

@Injectable()
export class HttpService {

    constructor(private spinner: SpinnerService, private httpClient: HttpClient) {}

    jsonp(url: string, callback: string): Observable<Object> {
        this.spinner.show();
        return this.httpClient.jsonp(url, callback).pipe(finalize(() => this.spinner.hide()));
    }

}
