import { BehaviorSubject, Observable, distinctUntilChanged, map } from "rxjs";

export class Atom<
  TStoreState extends { [key: string]: any } = any,
  TName extends string = any,
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
    private store: StoreSubject<TStoreState>,
  ) {}

  private _getValue<Y extends keyof TStoreState[TName]>(
    state: TStoreState,
    key?: Y,
  ) {
    if (key) {
      return state[this.params.key][key];
    } else return state[this.params.key] as TStoreState[TName];
  }

  getValue<
    Y extends TStoreState[TName] extends { [key: string]: any }
      ? keyof TStoreState[TName]
      : undefined,
  >(
    key: Y,
  ): Y extends keyof TStoreState[TName] ? TStoreState[TName][Y] : never;
  getValue(key?: undefined): TStoreState[TName];
  getValue(key?: TStoreState[TName]) {
    return this._getValue(this.store.getValue(), key);
  }

  get$<
    Y extends TStoreState[TName] extends { [key: string]: unknown }
      ? keyof TStoreState[TName]
      : undefined,
  >(
    key: Y,
  ): Y extends keyof TStoreState[TName]
    ? Observable<TStoreState[TName][Y]>
    : never;
  get$(key?: undefined): Observable<TStoreState[TName]>;
  get$(key?: any) {
    return this.store.pipe(
      map((state) => this._getValue(state, key)),
      distinctUntilChanged(),
    );
  }

  set$(value: Partial<TStoreState[TName]>) {
    const state = this.store.getValue();
    const prevValue = state[this.params.key];
    const update = (
      typeof value === "object" && value !== null
        ? Array.isArray(value)
          ? [...value]
          : { ...prevValue, ...value }
        : value
    ) as TStoreState;

    this.store.next({
      ...state,
      [this.params.key]: update,
    } as TStoreState);

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
