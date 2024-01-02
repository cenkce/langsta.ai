import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  map,
  share,
} from "rxjs";

type AtomParams<T extends string = string> = {
  key: T;
};

export class Atom<
  TState = any,
  TName extends string = string,
  _InternalM extends keyof TState | undefined = TState extends Record<string, any>
    ? keyof TState
    : undefined,
  _InternalA extends Record<TName, TState> = Record<TName, TState>,
> {
  static of<S = any, K extends string = string>(
    params: AtomParams<K>,
    store: StoreSubject<Record<K, S>>,
  ) {
    return new Atom<S, K>(params, store);
  }
  /**
   * Use Atom.of() instead
   */
  protected constructor(
    private params: AtomParams<TName>,
    private store: StoreSubject<_InternalA>,
  ) {}

  private _getValue(state: Record<TName, TState>, key?: _InternalM) {
    if (key) {
      return state[this.params.key][key];
    } else return state[this.params.key];
  }

  getValue(key?: _InternalM) {
    return this._getValue(this.store.getValue(), key);
  }

  get$<Y extends _InternalM>(
    key?: Y,
  ): Observable<
    TState extends Record<string, any> ? (Y extends string ? TState[Y] : TState) : TState
  > {
    return this.store.pipe(
      map((state) => this._getValue(state, key)),
      // @ts-ignore
      distinctUntilChanged(),
      share(),
    );
  }

  set$(value: Partial<TState>) {
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
      [this.params.key]: update,
    } as _InternalA);

    return this.store.asObservable();
  }

  [Symbol.dispose]() {
    this.store.complete();
  }
}

export class StoreSubject<T> extends BehaviorSubject<T> {
  static of<T = unknown>(initialData: T) {
    return new StoreSubject<T>(initialData);
  }
  next(value: T): void {
    if (!this._internalOnVerifyChange) super.next(value);
    else if (this._internalOnVerifyChange(this.value, value)) super.next(value);
  }

  _internalOnVerifyChange?: (prevState: T, newState: T) => boolean;
}
