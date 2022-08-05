export type LocalStorageNotAllowedType = string | number;
export type LocalStorageItemType<T> = T extends LocalStorageNotAllowedType ? never : T;

export interface LocalStorageItem<T> {
    value?: LocalStorageItemType<T>;
    expireDate?: Date;
    isExpired?: boolean;
}
