import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from "./sidebar.component";
import { SidebarService } from "./sidebar.service";

@NgModule({
    declarations: [SidebarComponent],
    providers: [SidebarService],
    imports: [CommonModule, FontAwesomeModule, RouterModule, NgbDropdownModule],
    exports: [SidebarComponent]
})
export class SidebarModule {}
