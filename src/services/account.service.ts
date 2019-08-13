import { DatabaseProvider } from './../database/index';
import { User } from '../models/User';
import * as crypto from 'crypto';
export class AccountService {

    public async forgotPassword(email: string): Promise<any> {
        const db = await DatabaseProvider.getConnection();
        // 1. check if email exist
        let user = await db.getRepository(User).findOne(email);

        let error = "";

        if(!user) {
            console.log('false');
            error = "Account does not exist";
            return error;
        }

        console.log('true');

        // set reset token and expiry
        user.resetPasswordToken = crypto.randomBytes(25).toString('hex');
        user.resetPasswordExpiryDate = Date.now() + 900000; // 15 minutes from now

        await db.getRepository(User).save(user);

        console.log(user);
    }
}