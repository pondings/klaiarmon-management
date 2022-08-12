import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, map, Observable, of, take } from "rxjs";
import { HttpService } from "src/app/shared/services/http.service";
import { environment } from "src/environments/environment";

@Injectable()
export class GoogleMapsLoaderService {

    private isMapLoaded$ = new BehaviorSubject<boolean>(false);

    constructor(private httpService: HttpService) { }

    subscribeIsLoaded(): Observable<boolean> {
        return this.isMapLoaded$;
    }

    load(): void {
        this.isMapLoaded$.pipe(take(1), filter(isLoaded => !isLoaded)).subscribe(_ => {
            this.httpService.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.google.mapApiKey}&libraries=places`, 'callback')
                .pipe(take(1), map(() => {
                    this.isMapLoaded$.next(true);
                    return true;
                }), catchError(() => {
                    this.isMapLoaded$.next(false);
                    return of(false);
                })).subscribe();
        });
    }

}
