import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, take } from "rxjs";
import { UserInfo } from "../models/user.model";
import { FireAuthService } from "../services/fire-auth.service";

@Injectable()
export class SidebarService {

    userInfo$ = new BehaviorSubject<UserInfo>({});
    toggle$ = new Subject<void>();

    constructor(private fireAuthService: FireAuthService) {}

    subscribeUserInfo(): Observable<UserInfo> {
        return this.userInfo$.asObservable();
    }

    async fetchUserInfo(): Promise<void> {
        const user = await this.fireAuthService.getCurrentUser();
        this.userInfo$.next(user);
    }

    triggerUpdateUserProfile(userInfo: UserInfo): void {
        this.userInfo$.next(userInfo);
    }

    logout(): void {
        this.fireAuthService.signout();
    }

    toggle(): void {
        this.toggle$.next();
    }

}
