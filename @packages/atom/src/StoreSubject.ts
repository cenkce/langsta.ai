import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  map,
} from "rxjs";

export class Atom<
  TState extends { [key: string]: any } = any,
  TName extends string = any
> {
  static of<T extends { [key: string]: any }, N extends string>(
    params: { key: N },
    store: StoreSubject<T>,
  ) {
    return new Atom<T, N>(params, store);
  }
  /**
   * Use Atom.of() instead
   */
  protected constructor(
    private params: {
      key: TName;
    },
    private store: StoreSubject<TState>,
  ) {}

  private _getValue<Y extends keyof TState[TName]>(state: TState, key?: Y) {
    if (key) {
      return state[this.params.key][key];
    } else return state[this.params.key] as TState;
  }

  getValue(
    key?: TState[TName] extends { [key: string]: any }
      ? keyof TState[TName]
      : undefined,
  ) {
    return this._getValue(this.store.getValue(), key);
  }

  get$<
    Y extends TState[TName] extends { [key: string]: any }
      ? keyof TState[TName]
      : undefined,
  >(key?: Y) {
    return this.store.pipe(
      map((state) => this._getValue(state, key)),
      distinctUntilChanged(),
    ) as Observable<
      Y extends keyof TState[TName] ? TState[TName][Y] : TState[TName]
    >;
  }

  set$(value: Partial<TState[TName]>) {
    const state = this.store.getValue();
    const prevValue = state[this.params.key];
    const update = (
      typeof value === "object" && value !== null
        ? Array.isArray(value)
          ? [...value]
          : { ...prevValue, ...value }
        : value
    ) as TState;

    this.store.next({
      ...state,
      [this.params.key]: update,
    } as TState);

    return this.store.asObservable();
  }

  [Symbol.dispose]() {
    this.store.complete();
  }
}

export class StoreSubject<T = any> extends BehaviorSubject<T> {
  static of<T = unknown>(initialData: T) {
    return new StoreSubject<T>(initialData);
  }
  next(value: T): void {
    if (!this._internalOnVerifyChange) super.next(value);
    else if (this._internalOnVerifyChange(this.value, value)) super.next(value);
  }

  _internalOnVerifyChange?: (prevState: T, newState: T) => boolean;
}
