import { Timestamp } from "firebase/firestore";
import { MetaData } from "src/app/model/meta-data";

export type NotificationMeta = MetaData & { isReaded?: boolean; };

export interface UserNotification {
    title: string
    content: string;
    to: string[];
    readed: string[];
    date: Timestamp;
    isAlert: boolean;
    meta: NotificationMeta;
}
