import { EventEmitter } from "events";

export type Output = string | Record<string, string | Error>;

export const trackOutput = (emitter: EventEmitter, event: string) => {
  let outpouts: Output[] = [];
  const trackerFn = (output: Output) => {
    outpouts.push(output);
  };
  emitter.on(event, trackerFn);

  const consume = () => {
    let result = [...outpouts];

    outpouts.length = 0;

    return result;
  };

  const turnOffTracking = () => {
    consume();
    emitter.off(event, trackerFn);
  };

  return { outpouts, turnOffTracking, consume };
};
