import { ObjectEntries } from "type-fest/source/entries";

export function objectEntries<K extends string, V, T extends Record<K, V>>(
  obj: T
) {
  return Object.entries(obj) as ObjectEntries<T>;
}
