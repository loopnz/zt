function Promise(executor) {
  var self = this;
  self.status = "pending";
  self.data = undefined;
  self.onResolvedCallback = [];
  self.onRejectedCallback = [];

  function resolve(value) {
    setTimeout(() => {
      if (self.status === "pending") {
        self.status = "resolved";
        self.data = value;
        self.onResolvedCallback.forEach(callback => {
          callback(value);
        });
      }
    });
  }
  function reject(reason) {
    setTimeout(() => {
      if (self.status === "pending") {
        self.status = "rejected";
        self.data = reason;
        self.onRejectedCallback.forEach(callback => {
          callback(reason);
        });
      }
    });
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function(onResolve, onReject) {
  var self = this;
  var promise2;

  if (self.status === "resolved") {
    return (promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onResolve(self.data);
        if (x instanceof Promise) {
          x.then(resolve, reject);
        } else {
          resolve(x);
        }
      } catch (e) {
        reject(e);
      }
    }));
  }
};

Promise.prototype.catch = function() {};
