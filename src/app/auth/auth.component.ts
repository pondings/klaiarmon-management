import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { FormBuilder, FormGroup } from "@angular/forms";

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
        private fb: FormBuilder) {
        // setTimeout(() => {
            // angularFireAuth.signInWithEmailAndPassword('pawarut.klaiarmon@gmail.com', 'Pond1234')
            // .then(console.log);
        // }, 5000);
        this.loginForm = this.createFormGroup();
    }

    login() {
        this.angularFireAuth.signInWithEmailAndPassword(this.usernameCtrl.value, this.passwordCtrl.value);
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
