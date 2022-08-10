import { FormControl } from "@angular/forms";
import { Nullable } from "src/app/common/types/common.type";

export interface EditProfile {
    displayName?: string;
    profilePhoto?: File;
}

export interface EditProfileForm {
    displayName: FormControl<Nullable<string>>;
    profilePhoto: FormControl<Nullable<File>>;
}
