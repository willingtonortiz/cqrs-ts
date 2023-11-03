import { Observable, Subject } from "rxjs";

export class ObservableBus<T> extends Observable<T> {
  protected _subject$ = new Subject<T>();
  public observable = this._subject$.asObservable();

  constructor() {
    super();
  }

  public get subject$() {
    return this._subject$;
  }
}
