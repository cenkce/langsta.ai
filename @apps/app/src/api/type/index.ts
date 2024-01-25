export type TupleToUnion<T> =
  T extends readonly [infer A, ...infer Rest]
    ? A | TupleToUnion<Rest>
    : never;
