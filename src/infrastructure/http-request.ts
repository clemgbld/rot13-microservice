import http from "http";
import { buildInfrastructure } from "./utils/buildInfrastructure";
import EventEmitter from "events";
export interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  readBodyAsync: () => Promise<string>;
}

interface Request {
  url: string;
  method: string;
  headers: Record<string, string>;
  on: (event: string, fn: any) => this;
  readableEnded: boolean;
  body: string;
}

interface NullHttpRequest extends EventEmitter, Request {}

export type DependancyHttpRequest = http.IncomingMessage | NullHttpRequest;

const withHttpRequest =
  (dependencyHttpRequest: DependancyHttpRequest) => (o: any) => {
    return {
      ...o,
      url: dependencyHttpRequest.url,
      method: dependencyHttpRequest.method,
      headers: Object.freeze(dependencyHttpRequest.headers),
      readBodyAsync: async () =>
        await new Promise((resolve, reject) => {
          if (dependencyHttpRequest.readableEnded) {
            throw new Error("Cannot read the body twice");
          }
          dependencyHttpRequest.on("error", reject);
          let body = "";
          dependencyHttpRequest.on("data", (chunk: string) => {
            body += chunk;
          });
          dependencyHttpRequest.on("end", () => {
            resolve(body);
          });
        }),
    };
  };

interface ConfigurableRequest {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

const normalizeHeaders = (headers: Record<string, string>) =>
  Object.entries(headers).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key.toLowerCase()]: value,
    }),
    {}
  );

class NullHttpRequest extends EventEmitter {
  constructor({
    url = "/my-null-url",
    method = "GET",
    headers = {},
    body = "",
  }: ConfigurableRequest) {
    super();
    this.url = url;
    this.method = method.toUpperCase();
    this.headers = normalizeHeaders(headers);
    this.readableEnded = false;
    this.body = body;
  }
  on(event: string, fn: any) {
    if (event === "data") {
      setImmediate(() => {
        fn(this.body);
      });
    }
    if (event === "end") {
      setImmediate(() => {
        fn();
        this.readableEnded = true;
      });
    }
    return this;
  }
}

export const httpRequest = {
  create: (request: http.IncomingMessage): any =>
    buildInfrastructure({
      dependancy: request,
      infrastructureObj: httpRequest,
      withMixin: withHttpRequest,
    }),

  createNull: (configurableRequest: ConfigurableRequest = {}): any =>
    buildInfrastructure({
      dependancy: new NullHttpRequest(configurableRequest),
      infrastructureObj: httpRequest,
      withMixin: withHttpRequest,
    }),
};
