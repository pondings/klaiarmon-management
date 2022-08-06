import { Action } from "src/app/common/enum/action";

export interface ConfirmModalOptions {
    action: Action;
    title: string;
    content: string;
}
