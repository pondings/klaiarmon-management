import { FormControl } from "@angular/forms";
import { Nullable } from "src/app/common/types/common.type";

export interface EditProfileForm {
    displayName: FormControl<Nullable<string>>;
    photoUrl: FormControl<Nullable<string>>;
}
