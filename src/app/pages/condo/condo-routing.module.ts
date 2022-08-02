import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CondoComponent } from "./condo.component";

const routes: Routes = [
    { path: '', component: CondoComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CondoRoutingModule { }
