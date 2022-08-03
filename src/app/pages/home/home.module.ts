import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./containers/home/home.component";
import { HomeDocumentComponent } from "./containers/document/document.component";

@NgModule({
    declarations: [HomeComponent, HomeDocumentComponent],
    imports: [CommonModule, HomeRoutingModule]
})
export class HomeModule { }
