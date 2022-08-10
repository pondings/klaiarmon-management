import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './core/core.module';
import { AuthLayoutComponent } from './layout/auth-layout.component';
import { HomeLayoutComponent } from './layout/home-layout.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { BUCKET } from '@angular/fire/compat/storage';
import { AuthModule } from './auth/auth.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { CustomCalendarDateFormatter } from './core/providers/calendar-date-formatter.service';
import { HammerModule, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { AppHammerGestureConfig } from './core/providers/hammer-gesture.provider';
import { CustomDateFormatter } from './core/providers/custom-date-formatter.provider';

export function momentAdapterFactory(): DateAdapter {
  return adapterFactory(moment);
};

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
      { dateFormatter: { provide: CalendarDateFormatter, useClass: CustomCalendarDateFormatter } })
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: HAMMER_GESTURE_CONFIG, useClass: AppHammerGestureConfig },
    { provide: BUCKET, useValue: 'gs://klaiarmon-management.appspot.com' },
    { provide: NgbDateParserFormatter, useClass: CustomDateFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
