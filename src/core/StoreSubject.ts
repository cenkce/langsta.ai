import { BehaviorSubject, Observable, distinctUntilChanged, map } from "rxjs";

type AtomParams<T extends string = string> = {
  key: T;
};

export class Atom<
  T = any,
  P extends string = string,
  M = T extends Record<string, any> ? keyof T : undefined
> {
  static of<
    S = any,
    K extends string = string
  >(params: AtomParams<K>, store: StoreSubject<Record<K, S>>) {
    return new Atom<S, K>(params, store);
  }
  /**
   * Use Atom.of() instead
   */
  protected constructor(
    private params: AtomParams<P>,
    private store: StoreSubject<Record<AtomParams<P>["key"], T>>
  ) {}

  private _getValue(state: Record<P, T>, key?: M) {
    // @ts-expect-error
    return key ? state[this.params.key][key] : state[this.params.key];
  }

  getValue() {
    return this._getValue(this.store.getValue());
  }

  get$<Y extends M>(key?: Y): Observable<T extends Record<string, any>
  ? Y extends string
    ? T[Y]
    : T
  : T> {
    return this.store.pipe(
      map(
        (state) =>
          this._getValue(state, key)
      ),
      distinctUntilChanged()
    );
  }
  set$(value: T extends Record<string, infer H> ? Partial<H> : T) {
    const state = this.store.getValue();
    const prevValue: Partial<T> = state[this.params.key] || {};
    const update = (
      typeof value === "object" ? { ...prevValue, ...value } : value
    ) as T;

    this.store.next({
      [this.params.key]: update,
    } as Record<P, T>);
  }
}

export class StoreSubject<T> extends BehaviorSubject<T> {
  next(value: T): void {
    if (!this._internalOnVerifyChange) super.next(value);
    else if (this._internalOnVerifyChange(this.value, value)) super.next(value);
  }

  _internalOnVerifyChange?: (prevState: T, newState: T) => boolean;
}

export const createStore = <T = any>(initialData: T) => {
  return new StoreSubject<T>(initialData);
};
