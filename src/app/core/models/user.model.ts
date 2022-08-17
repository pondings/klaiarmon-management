export interface User {
    uid: string;
    displayName: string;
    photoURL: string;
}

export type UserInfo = Partial<User>;
