import { User } from "./../models/User";
export interface IUserObserver {
  userCreated(user: User): void;
}
