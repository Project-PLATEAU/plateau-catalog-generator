import Deferred from "./Deferred";
import { jest } from "@jest/globals";

const noop: (...args: any) => void = () => {
  // do nothing
};

describe("Deferred", () => {
  describe("then()", () => {
    describe("when fulfilled", () => {
      it("calls the callback immediately", () => {
        const d = new Deferred<string>((r) => r("foo"));
        const cb = jest.fn();
        d.then(cb);
        expect(cb).toBeCalledWith("foo");
      });
    });
    describe("when pending", () => {
      it("calls the callback after the deferred is fulfilled", () => {
        let resolve = noop;
        const d = new Deferred<string>((r) => (resolve = r));
        const cb = jest.fn();
        d.then(cb);
        expect(cb).not.toBeCalled();
        resolve("foo");
        expect(cb).toBeCalledWith("foo");
      });
    });
    it("is chainable", () => {
      const d = new Deferred<string>((r) => r("foo"));
      const cb1 = jest.fn((str: string) => str + "bar");
      // ^ Return value is a normal value.
      const cb2 = jest.fn((str: string) => new Deferred((r) => r(str + "baz")));
      // ^ Return value is a deferred.
      const cb3 = jest.fn();
      d.then(cb1).then(cb2).then(cb3);
      expect(cb1).toBeCalledWith("foo");
      expect(cb2).toBeCalledWith("foobar");
      expect(cb3).toBeCalledWith("foobarbaz");
    });
  });
  describe("all()", () => {
    it("resolves after all the given defer objects have resolved", () => {
      let resolve1 = noop,
        resolve2 = noop,
        resolve3 = noop;
      const deferred1 = new Deferred((r) => (resolve1 = r));
      const deferred2 = new Deferred((r) => (resolve2 = r));
      const deferred3 = new Deferred((r) => (resolve3 = r));
      const cb = jest.fn();
      Deferred.all([deferred1, deferred2, deferred3]).then(cb);
      expect(cb).not.toBeCalled();
      resolve1("a");
      expect(cb).not.toBeCalled();
      resolve2("b");
      expect(cb).not.toBeCalled();
      resolve3("c");
      expect(cb).toBeCalledWith(["a", "b", "c"]);
    });
    it("immediately resolves if given an empty array", () => {
      const cb = jest.fn();
      Deferred.all([]).then(cb);
      expect(cb).toBeCalledWith([]);
    });
  });
});
