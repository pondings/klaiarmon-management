import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CondoRoutingModule } from "./condo-routing.module";
import { CondoComponent } from "./condo.component";

@NgModule({
    declarations: [CondoComponent],
    imports: [CommonModule, CondoRoutingModule]
})
export class CondoModule { }
