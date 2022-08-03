import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CondoComponent } from "./containers/condo/condo.component";
import { CondoDocumentComponent } from "./containers/document/document.component";

const routes: Routes = [
    { path: '', component: CondoComponent },
    { path: 'document', component: CondoDocumentComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CondoRoutingModule { }
