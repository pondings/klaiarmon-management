import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent {

    loginForm: FormGroup;

    constructor(private angularFireAuth: AngularFireAuth,
        private router: Router,
        private fb: FormBuilder) {
        this.loginForm = this.createFormGroup();
    }

    login() {
        this.angularFireAuth.signInWithEmailAndPassword(this.usernameCtrl.value, this.passwordCtrl.value)
            .then(userInfo => this.router.navigate(['']));
    }

    get usernameCtrl() {
        return this.loginForm.controls['username'];
    }

    get passwordCtrl() {
        return this.loginForm.controls['password'];
    }

    private createFormGroup(): FormGroup {
        return this.fb.group({
            username: [''],
            password: ['']
        })
    }

}
