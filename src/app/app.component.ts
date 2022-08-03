import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SpinnerService } from './core/spinner/spinner.service';
import { MenuService } from './service/menu.service';

@Component({
  selector: 'km-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  isShowSpinner$: BehaviorSubject<boolean>;

  constructor(private spinnerService: SpinnerService,
      menuService: MenuService) {
    this.isShowSpinner$ = spinnerService.isShowSpinner$;
  }

}
