import http from "http";
import { pipe } from "ramda";
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
  body: string | Record<string, string>;
}

export interface RequestAdapter {
  url: string;
  method: string | undefined;
  headers: Readonly<Record<string, string> | http.IncomingHttpHeaders>;
  readBodyAsync: () => Promise<string>;
  hasContentType: (contentType: string) => boolean;
}

interface NullHttpRequest extends EventEmitter, Request {}

export type DependancyHttpRequest = http.IncomingMessage | NullHttpRequest;

const withHttpRequest =
  (dependencyHttpRequest: DependancyHttpRequest) => (o: any) => {
    let headers = Object.freeze(dependencyHttpRequest.headers);

    const ignoreParameters = (contentType?: string) =>
      contentType?.split(";")[0];

    const normalizeContentType = (contentType?: string) =>
      contentType?.toLowerCase().trim();

    const normalizeContentTypeFromHeaders = pipe(
      ignoreParameters,
      normalizeContentType
    );

    return {
      ...o,
      url: dependencyHttpRequest.url,
      method: dependencyHttpRequest.method,
      headers,
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
      hasContentType: (contentType: string) =>
        normalizeContentTypeFromHeaders(headers["content-type"]) ===
        normalizeContentType(contentType),
    };
  };

export interface ConfigurableRequest {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string | Record<string, string>;
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
