const noop = () => {
  // do nothing.
};

export default class Deferred<T> {
  resolvedValue: T = undefined as any;
  status: "pending" | "fulfilled" = "pending";

  private onDone = noop;

  constructor(cb: (resolve: (value: T) => void) => void) {
    cb(this.resolve.bind(this));
  }

  static all<U1, U2, U3, U4>(
    deferreds: readonly [Deferred<U1>, Deferred<U2>, Deferred<U3>, Deferred<U4>]
  ): Deferred<[U1, U2, U3, U4]>;
  static all<U1, U2, U3>(
    deferreds: readonly [Deferred<U1>, Deferred<U2>, Deferred<U3>]
  ): Deferred<[U1, U2, U3]>;
  static all<U1, U2>(
    deferreds: readonly [Deferred<U1>, Deferred<U2>]
  ): Deferred<[U1, U2]>;
  static all<U>(deferreds: readonly Deferred<U>[]): Deferred<U[]>;
  static all(deferreds: readonly Deferred<any>[]): Deferred<any[]> {
    return new Deferred((resolve) => {
      const values = new Array(deferreds.length);
      let doneCount = 0;
      const resolveIfPossible = () => {
        if (doneCount === deferreds.length) {
          resolve(values);
        }
      };
      deferreds.forEach((d, i) => {
        d.then((v) => {
          values[i] = v;
          doneCount += 1;
          resolveIfPossible();
        });
      });
      resolveIfPossible();
    });
  }

  private resolve(value: T) {
    this.resolvedValue = value;
    this.status = "fulfilled";
    this.onDone();
  }

  then<U>(cb: (value: T) => Deferred<U>): Deferred<U>;
  then<U>(cb: (value: T) => U): Deferred<U>;
  then<U>(cb: (value: T) => U): Deferred<U> {
    const callCb = (resolve: (value: U) => void) => {
      const cbValue = cb(this.resolvedValue);
      if (cbValue instanceof Deferred) {
        // The callback returned a deferred. Unwrap it.
        cbValue.then(resolve);
      } else {
        // Just resolve with the return value of the cb
        resolve(cbValue);
      }
    };
    if (this.status === "pending") {
      return new Deferred((resolve) => {
        if (this.onDone !== noop) {
          throw new Error("Cannot call then() more than once.");
        }
        this.onDone = () => callCb(resolve);
      });
    } else if (this.status === "fulfilled") {
      return new Deferred(callCb);
    }
    throw new Error(`illegal status ${this.status}`);
  }
}
