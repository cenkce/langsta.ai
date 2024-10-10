import { BehaviorSubject, Observable, distinctUntilChanged, map } from "rxjs";

export class Atom<
  TStoreState extends { [key: string]: any } = any,
  TName extends string | undefined = any,
  State extends TName extends string
    ? TStoreState[TName]
    : TStoreState = TName extends string ? TStoreState[TName] : TStoreState,
> {
  static of<T extends { [key: string]: any } = any>(
    store: StoreSubject<T>,
  ): Atom<T, undefined>;
  static of<T extends { [key: string]: any } = any, N extends string = string>(
    params: { key?: N },
    store: StoreSubject<T>,
  ): Atom<T, N>;
  static of<T extends { [key: string]: any }, N extends string = string>(
    params: any,
    store?: StoreSubject<T>,
  ) {
    return params instanceof StoreSubject
      ? new Atom<T, N>({}, params)
      : new Atom<T, undefined>(params, store as StoreSubject<T>);
  }
  /**
   * Use Atom.of() instead
   */
  protected constructor(
    private params: {
      key?: TName | undefined;
    },
    private store: StoreSubject<TStoreState>,
  ) {}

  private _getValue<
    Y extends TName extends string
      ? keyof TStoreState[TName]
      : keyof TStoreState,
  >(state: TStoreState, key?: Y) {
    if (key) {
      return this.params.key
        ? state[this.params.key][key]
        : state[key as string];
    } else
      return this.params.key
        ? (state[this.params.key] as TName extends string
            ? TStoreState[TName]
            : never)
        : state;
  }

  getValue<Y extends keyof State>(key: Y): State[Y];
  getValue(key?: undefined): State;
  getValue(key?: any) {
    return this._getValue(this.store.getValue(), key);
  }

  get$<Y extends keyof State>(key: Y): Observable<State[Y]>;
  get$(key?: undefined): Observable<State>;
  get$(key?: any) {
    return this.store.pipe(
      map((state) => this._getValue(state, key)),
      distinctUntilChanged(),
    );
  }

  set$(
    value: Partial<TName extends string ? TStoreState[TName] : TStoreState>,
  ) {
    const state = this.store.getValue();
    const prevValue = this._getValue(state);
    const update = (
      typeof value === "object" && value !== null
        ? Array.isArray(value)
          ? [...value]
          : prevValue instanceof Map
            ? value instanceof Map
              ? new Map([...prevValue.entries(), ...value.entries()])
              : new Map([...prevValue.entries(), ...Object.entries(value)])
            : { ...prevValue, ...value }
        : value
    ) as TStoreState;

    this.store.next(
      this.params.key
        ? {
            ...state,
            [this.params.key as string]: update,
          }
        : update,
    );

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
