import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './core/core.module';
import { AuthLayoutComponent } from './layout/auth-layout.component';
import { HomeLayoutComponent } from './layout/home-layout.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AuthModule } from './auth/auth.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { CustomDateFormatter } from './pages/dashboard/services/calendar-date-formatter.service';
import { HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import * as Hammer from 'hammerjs';

export function momentAdapterFactory(): DateAdapter {
  return adapterFactory(moment);
};

@Injectable()
export class CalendarGestureConfig extends HammerGestureConfig {
    override overrides = <any>{
        swipe: { direction: Hammer.DIRECTION_ALL }
    };
}

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    HomeLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    NgbModule,
    HammerModule,
    CoreModule,
    AuthModule,
    FontAwesomeModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }, 
      { dateFormatter: { provide: CalendarDateFormatter, useClass: CustomDateFormatter } })
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CalendarGestureConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
