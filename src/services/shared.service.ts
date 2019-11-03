import * as crypto from "crypto";
import { injectable } from "inversify";

@injectable()
export class SharedService {
	public generateToken(length: number): any {
		if (length != null) return crypto.randomBytes(length).toString("hex");
	}
}
