import { Timestamp } from "firebase/firestore";
import { MetaData } from "src/app/model/meta-data";

export interface UserNotification {
    title: string
    content: string;
    date: Timestamp;
    isRead: boolean;
    isAlert: boolean;
    meta: MetaData;
}
