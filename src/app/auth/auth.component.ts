import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SpinnerService } from "../core/spinner/spinner.service";
import { ToastService } from "../core/toast/toast.service";

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
        private spinnerService: SpinnerService,
        private toastService: ToastService,
        private router: Router,
        private fb: FormBuilder) {
        this.loginForm = this.createFormGroup();
    }

    login() {
        this.spinnerService.show();
        this.angularFireAuth.signInWithEmailAndPassword(this.usernameCtrl.value, this.passwordCtrl.value)
            .then(credential => this.successLogin(credential.user?.displayName || credential.user?.email))
            .catch(_ => this.toastService.showError('Something went wrong, please contact Pondz.'))
            .finally(() => this.spinnerService.hide());
    }

    successLogin(displayName: string | null | undefined): void {
        this.router.navigate(['']);
        this.toastService.showSuccess(`Greeting ${displayName}`);
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
