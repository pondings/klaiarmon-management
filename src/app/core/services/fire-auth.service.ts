import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { firstValueFrom, Observable, Subject } from "rxjs";
import { takeOnce } from "src/app/common/utils/rxjs-util";
import { UserInfo } from "../models/user.model";
import { FirestoreService } from "./firestore.service";

@Injectable()
@UntilDestroy({ checkProperties: true })
export class FireAuthService {

    private userInfo$!: Observable<UserInfo>;
    private allUsers$: Observable<UserInfo[]>;

    constructor(private angularFireAuth: AngularFireAuth,
        private fireStoreService: FirestoreService,
        private router: Router) {
        this.allUsers$ = this.fireStoreService.getCollection<UserInfo>('users');
        angularFireAuth.currentUser.then(fireUser => 
            this.userInfo$ = this.fireStoreService.getDocument<UserInfo>(`users/${fireUser?.uid}`).pipe(takeOnce()));
    }

    subscribeUserInfo(): Observable<UserInfo> {
        return this.userInfo$;
    }

    async getCurrentUser(): Promise<UserInfo> {
        return await firstValueFrom(this.userInfo$);
    }

    async getAllUsers(): Promise<UserInfo[]> {
        return await firstValueFrom(this.allUsers$);
    }

    async updateUserInfo(userInfo: UserInfo): Promise<void> {
        const currentUser = await this.angularFireAuth.currentUser;
        currentUser?.updateProfile(userInfo);
        await this.fireStoreService.updateDocument(`users/${currentUser?.uid}`, userInfo);
    }

    signout(): void {
        this.angularFireAuth.signOut().then(_ => this.router.navigate(['login']));
    }

    async getUserByUid(uid: string): Promise<UserInfo> {
        const userInfos = await firstValueFrom(this.allUsers$);
        return userInfos.find(this.matchWithUidPredicate(uid))!;
    }

    async getUsernameByUid(uid: string): Promise<string> {
        const userInfos = await firstValueFrom(this.allUsers$);
        return userInfos.find(this.matchWithUidPredicate(uid))?.displayName!;
    }

    private matchWithUidPredicate(uid: string): (userInfo: UserInfo) => boolean {
        return userInfo => userInfo.uid === uid;
    }

}
