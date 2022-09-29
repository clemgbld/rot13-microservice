const drainEventLoopAsync = async () => {
  await new Promise((resolve, reject) => {
    setImmediate(() => {
      setImmediate(resolve);
    });
  });
};

expect.extend({
  // does not work when you use setImmediate in your own code
  toNotBeAResolvedPromise: async (promise: Promise<any>) => {
    let promiseResolved = false;

    promise.then(() => {
      promiseResolved = true;
    });

    await drainEventLoopAsync();

    return {
      pass: !promiseResolved,
      message: () => "Expected promise to not be resolved",
    };
  },
});

export {};
