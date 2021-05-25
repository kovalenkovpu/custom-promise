const STATUSES = {
  pending: "pending",
  resolved: "resolved",
  rejected: "rejected",
};

class CustomPromise {
  constructor(initializer) {
    initializer(this.resolve, this.reject);
  }

  data = undefined;

  status = STATUSES.pending;

  cbStack = [];

  static resolve = (data) => {
    this.status = STATUSES.resolved;
    this.data = data;

    return this;
  };

  static then = (dataCallback) => {
    const result = dataCallback(this.data);

    if (result instanceof CustomPromise) {
      return result;
    }

    return CustomPromise.resolve(result);
  };

  resolve = (data) => {
    this.status = STATUSES.resolved;
    this.data = data;

    const [currentThenCb] = this.cbStack;

    if (currentThenCb) {
      const thenCallResult = currentThenCb(this.data);

      this.cbStack.splice(0, 1);

      if (thenCallResult instanceof CustomPromise) {
        thenCallResult.cbStack = this.cbStack;
        this.status = STATUSES.pending;
        this.data = undefined;

        return thenCallResult;
      }

      return this.resolve(thenCallResult);
    }

    return;
  };

  then = (dataCallback) => {
    if (this.status === STATUSES.resolved) {
      return dataCallback(this.data);
    }

    this.cbStack.push(dataCallback);

    return this;
  };

  reject() {}
  catch() {}
  finally() {}
}

/*
  For dev purposes:

  const promise = new CustomPromise((res, rej) => {
    setTimeout(() => res("Hello!"), 1000);
  });
  
  console.log("Start...");
  
  promise
    .then((data) => {
      console.log("1st:", data); // 1st: Hello!
  
      return new CustomPromise((res) => {
        setTimeout(() => res("Bye!"), 2000);
      });
    })
    .then((data) => {
      console.log("2nd:", data); // 2nd: Bye!
  
      return "Hello again!";
    })
    .then((data) => {
      console.log("3rd:", data); // 3rd: Hello again!
    })
    .then((data) => {
      console.log("4th:", data); // 4th:
    });
    .catch(err => console.log(`Error: ${err}`));
*/

module.exports = { CustomPromise };
