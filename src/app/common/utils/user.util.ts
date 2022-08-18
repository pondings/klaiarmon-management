import { UserInfo } from "src/app/core/models/user.model";
import { HasMetaData } from "src/app/model/meta-data";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";

export const mapToUid: (user: UserInfo) => string = (user: UserInfo) => user.uid!;

export function transformUsername(usernamePipe: UsernamePipe): (uid: string) => Promise<string> {
    return uid => new Promise(async (resolve) => {
        return resolve(await usernamePipe.transform(uid));
    })
}
export function filterUidNotEqualToUpdatedBy<T>(target: HasMetaData<T>): (uid: string) => boolean {
    return uid => target.meta.updatedBy !== uid;
}
export function filterUidNotMatch(uid: string): (user: UserInfo) => boolean {
    return user => user.uid !== uid;
}
