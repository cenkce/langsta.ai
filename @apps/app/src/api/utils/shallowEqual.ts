// from react-redux/src/utils/shallowEqual.ts

function is(x: unknown, y: unknown) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

export default function shallowEqual(objA: unknown, objB: unknown) {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      typeof objA === "object" &&
      typeof objB === "object" &&
      (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
        !is(
          (objA as Record<string, unknown>)[keysA[i] as string],
          (objB as Record<string, unknown>)[keysA[i]],
        ))
    ) {
      return false;
    }
  }

  return true;
}
