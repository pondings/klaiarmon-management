import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpinnerService } from './core/spinner/spinner.service';
import { HttpService } from './shared/services/http.service';

@Component({
  selector: 'km-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  isShowSpinner$: BehaviorSubject<boolean>;
  isMapLoaded$!: Observable<boolean>;

  constructor(spinnerService: SpinnerService, httpService: HttpService) {
    this.isShowSpinner$ = spinnerService.isShowSpinner$;
    this.isMapLoaded$ = httpService.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.google.mapApiKey}&libraries=places`, 'callback')
      .pipe(map(() => true), catchError(() => of(false)));
  }

}
