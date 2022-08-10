import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

@Injectable()
export class FireAuthService {

    private userInfo$ = new Subject<Partial<firebase.default.UserInfo>>();

    constructor(private angularFireAuth: AngularFireAuth,
        private router: Router) { }

    subscribeUserInfo(): Observable<Partial<firebase.default.UserInfo>> {
        this.getCurrentUser().then(userInfo => this.userInfo$.next(userInfo!));
        return this.userInfo$.asObservable();
    }

    triggerSubscribedUserInfo(userInfo: Partial<firebase.default.UserInfo>): void {
        this.userInfo$.next({ displayName: userInfo?.displayName!, photoURL: userInfo?.photoURL });
    }

    getCurrentUser(): Promise<firebase.default.UserInfo | null> {
        return this.angularFireAuth.currentUser;
    }

    async updateUserInfo(userInfo: Partial<firebase.default.UserInfo>): Promise<void> {
        const currentUser = await this.angularFireAuth.currentUser;
        currentUser?.updateProfile(userInfo);
    }

    signout(): void {
        this.angularFireAuth.signOut().then(_ => this.router.navigate(['login']));
    }

}
