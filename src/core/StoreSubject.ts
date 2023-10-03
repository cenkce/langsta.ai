import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";

type AtomParams<T extends string = string> = {
  key: T;
};

export class Atom<
  T extends Record<string, Record<string, any> | any> = Record<string, Record<string, any> | any>,
  P extends string = T extends Record<infer N, any> ? N : string,
  M extends string = T extends Record<string, infer O> ? O extends Record<infer N, any> ? N : string : string,
> {
  static of<
    S extends Record<string, any> = Record<string, any>,
    K extends string = string
    //  = S extends Record<infer N, any> ? N : string
  >(params: AtomParams<K>, store: StoreSubject<S>) {
    return new Atom<S, K>(params, store);
  }
  protected constructor(
    private params: AtomParams<P>,
    private store: StoreSubject<T>
  ) {}

  get$(key?:  M) {
    return this.store.pipe<T, T[P] extends Record<string, any> ? T[P][M] : T[P]>(
      map((state: T) =>
        key ? state[this.params.key][key] : state[this.params.key]
      ),
      distinctUntilChanged<T[P][M]>()
    );
  }
  set$(value: T extends Record<string, infer H> ? Partial<H> : any) {
    const state = this.store.getValue();
    const prevValue = state[this.params.key] as T;
    const update = typeof value === 'object' ? {...prevValue, ...value} : value;

    this.store.next({
      [this.params.key]: update
    } as T);
  }
}
// type ArrayToUnion<T extends any[] = any[]> = T extends (infer R)[] ? R : any[];

export class StoreSubject<T> extends BehaviorSubject<T> {
  next(value: T): void {
    if (!this._internalOnVerifyChange) super.next(value);
    else if (this._internalOnVerifyChange(this.value, value)) super.next(value);
  }

  _internalOnVerifyChange?: (prevState: T, newState: T) => boolean;
}
