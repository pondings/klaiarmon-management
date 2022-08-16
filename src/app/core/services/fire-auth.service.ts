import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { FirestoreService } from "./firestore.service";

export type UserInfo = Partial<firebase.default.UserInfo>;

@Injectable()
@UntilDestroy({ checkProperties: true })
export class FireAuthService {

    private userInfo$ = new Subject<UserInfo>();
    private allUsers$ = new BehaviorSubject<UserInfo[]>([]);

    constructor(private angularFireAuth: AngularFireAuth,
        private firestoreService: FirestoreService,
        private router: Router) {
        firestoreService.getCollection<UserInfo>('users').pipe(takeOnce()).subscribe(userInfos => 
            this.allUsers$.next(userInfos!));
    }

    subscribeUserInfo(): Observable<UserInfo> {
        this.angularFireAuth.currentUser.then(userInfo =>
            this.firestoreService.subscribeDocument<UserInfo>(`users/${userInfo?.uid}`).subscribe(user =>
                this.userInfo$.next(user!)));
        return this.userInfo$.asObservable();
    }

    triggerSubscribedUserInfo(userInfo: UserInfo): void {
        this.userInfo$.next({ displayName: userInfo?.displayName!, photoURL: userInfo?.photoURL });
    }

    async getCurrentUser(): Promise<UserInfo> {
        return (await this.angularFireAuth.currentUser)!;
    }

    getCurrentUser$(): Observable<UserInfo> {
        return this.userInfo$.asObservable();
    }

    getAllUsers(): Observable<UserInfo[]> {
        return this.allUsers$;
    }

    async updateUserInfo(userInfo: UserInfo): Promise<void> {
        const currentUser = await this.angularFireAuth.currentUser;
        currentUser?.updateProfile(userInfo);
        this.firestoreService.updateDocument(`users/${currentUser?.uid}`, userInfo);
    }

    signout(): void {
        this.angularFireAuth.signOut().then(_ => this.router.navigate(['login']));
    }

    async getUserByUid(uid: string): Promise<UserInfo> {
        return this.allUsers$.getValue().find(user => user.uid === uid)!
    }

    async getUsernameByUid(uid: string): Promise<string> {
        const users = this.allUsers$.getValue();
        return users.find(user => user.uid === uid)?.displayName!;
    }

}
