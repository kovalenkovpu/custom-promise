const { expect } = require("chai");
const { CustomPromise } = require("../src/callback-based-promise.js");

describe("CustomPromise based on callbacks", () => {
  const resolveData = "mock data";
  const nextResolveData = "next mock data";

  it("should resolve immediately with proper data", () => {
    const promise = new CustomPromise((resolve) => resolve(resolveData));

    return promise.then((data) => expect(data).to.equal(resolveData));
  });

  it("should resolve immediately with undefined", () => {
    const promise = new CustomPromise((resolve) => resolve());

    return promise.then((data) => expect(data).to.be.undefined);
  });

  it("should resolve with proper data after some time", () => {
    const promise = new CustomPromise((resolve) =>
      setTimeout(() => resolve(resolveData), 10)
    );

    return promise.then((data) => expect(data).to.equal(resolveData));
  });

  it('should chain in case next "then" returns non-promise data', () => {
    const promise = new CustomPromise((resolve) =>
      setTimeout(() => resolve(resolveData), 10)
    );

    return promise
      .then((data) => {
        expect(data).to.equal(resolveData);

        return nextResolveData;
      })
      .then((data) => expect(data).to.equal(nextResolveData));
  });

  it('should chain in case next "then" returns another promise', () => {
    const promise = new CustomPromise((resolve) =>
      setTimeout(() => resolve(resolveData), 10)
    );

    return promise
      .then((data) => {
        expect(data).to.equal(resolveData);

        return new CustomPromise((resolve) =>
          setTimeout(() => resolve(nextResolveData), 50)
        );
      })
      .then((data) => expect(data).to.equal(nextResolveData));
  });

  describe("Static methods", () => {
    it('should correctly work with static "resolve" method', () => {
      CustomPromise.resolve(resolveData).then((data) =>
        expect(data).to.equal(resolveData)
      );
    });

    it(`should correctly work with static "resolve" method
    when one of next "then" returns a promise`, () => {
      CustomPromise.resolve(resolveData)
        .then((data) => {
          expect(data).to.equal(resolveData);

          return new CustomPromise((resolve) =>
            setTimeout(() => resolve(nextResolveData), 50)
          );
        })
        .then((data) => expect(data).to.equal(nextResolveData));
    });
  });
});
