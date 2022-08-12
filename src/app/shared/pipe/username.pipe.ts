import { Pipe, PipeTransform } from "@angular/core";
import { FireAuthService } from "../../core/services/fire-auth.service";

@Pipe({ name: 'username' })
export class UsernamePipe implements PipeTransform {

    constructor(private fireAuthService: FireAuthService) { }

    async transform(uid: string): Promise<string> {
        return await this.fireAuthService.getUsernameByUid(uid);
    }

}
