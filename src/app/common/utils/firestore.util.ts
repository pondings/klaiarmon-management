import { Timestamp } from "firebase/firestore";
import { isContainProperty, isNotNull, isNotNullOrUndefined, isObject, isUndefined } from './common-util';

export const cleanData = (data: any): any => {
    Object.keys(data).forEach(key => {
        if (isObject(data[key]) && isNotNull(data[key])) {
            data[key] = cleanData(data[key]);
        } else if (isUndefined(data[key])) {
            delete data[key];
        }
    });
    return data;
}

export const convertFirestoreTimestampProperties = (data: any) => {
    Object.keys(data).forEach(key => {
        if (isObject(data[key]) && isNotNullOrUndefined(data[key])) {
            if (isContainProperty(data[key], 'seconds')) {
                data[key] = convertToFirestoreTimestamp(data[key]);
            } else {
                convertFirestoreTimestampProperties(data[key]);
            }
        }
    });
    return data;
}

export const convertToFirestoreTimestamp = (target: any): Timestamp => Timestamp.fromMillis(target.seconds * 1000);
