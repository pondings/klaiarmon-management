import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeDocumentComponent } from "./containers/document/document.component";
import { HomeComponent } from "./containers/home/home.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'document', component: HomeDocumentComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
