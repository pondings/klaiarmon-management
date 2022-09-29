import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { CardComponent } from "./card.component";

@NgModule({
    declarations: [CardComponent],
    imports: [
        CommonModule,
        NgbCollapseModule,
        FontAwesomeModule
    ],
    exports: [CardComponent]
})
export class CardModule {}