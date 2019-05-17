import { IObserver } from "./IObserver";

export interface ISubject {
  registerObserver(o: IObserver);
  removeObserver(o: IObserver);
  notifyObserver();
}
