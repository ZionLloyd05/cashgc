import { IUserObserver } from "./IObserver";

export interface ISubject {
  registerObserver(o: IUserObserver);
  removeObserver(o: IUserObserver);
  notifyObserver();
}
