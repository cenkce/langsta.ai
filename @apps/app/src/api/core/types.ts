export type ArrayToUnion<T extends any[] = any[]> = T extends (infer R)[] ? R : any[];
