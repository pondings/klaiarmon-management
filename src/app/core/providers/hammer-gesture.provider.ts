import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";

import * as Hammer from 'hammerjs';

@Injectable()
export class AppHammerGestureConfig extends HammerGestureConfig {
    override overrides = <any>{
      swipe: { direction: Hammer.DIRECTION_HORIZONTAL }
    };

    override options = <any> {
      touchAction: 'pan-y'
    }
}