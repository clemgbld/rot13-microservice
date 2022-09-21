export const withConstructor = (constuctor: any) => (o: any) => ({
  __proto__: {
    constuctor,
  },
  ...o,
});
