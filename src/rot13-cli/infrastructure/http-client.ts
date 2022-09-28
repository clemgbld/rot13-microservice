import http from "http";
import EventEmitter from "events";
import { trackOutput, Output } from "../../infrastructure/utils/trackOutput";

type HTTP = typeof http;

const REQUEST_EVENT = "REQUEST_EVENT";

interface Request {
  host: string;
  port: number;
  method: string;
  headers?: Record<string, string>;
  path: string;
  body?: string;
}

export interface Response {
  status: number;
  headers?: Record<string, string>;
  body: string;
}

type ConfigurableResponses = Record<string, Response[]>;

interface NullHttp {
  request: (request: Request) => EventEmitter;
}

class NullResponse extends EventEmitter {
  constructor(private _res: Response = { status: 503, body: "" }) {
    super();
    setImmediate(() => {
      this.emit("data", this._res.body);
      this.emit("end");
    });
  }

  get statusCode() {
    return this._res.status;
  }

  get headers() {
    return this._res.headers;
  }
}

class NullRequest extends EventEmitter {
  constructor(private _res: Response[] = []) {
    super();
  }

  end(_: string) {
    setImmediate(() => {
      this.emit("response", new NullResponse(this._res.shift()));
    });
    return this;
  }
}

const nullHttp = (res: ConfigurableResponses) => ({
  request: ({ path }: { path: string }) => new NullRequest(res[path]),
});

const normalizeHeaders = (headers: Record<string, string>) =>
  Object.entries(headers).reduce(
    (acc: Record<string, string>, [key, value]) => ({
      ...acc,
      [key.toLowerCase()]: value,
    }),
    {}
  );

export interface HTTPClient {
  requestAsync: ({
    host,
    port,
    method,
    headers,
    path,
    body,
  }: Request) => Promise<Response>;
  trackRequests: () => {
    outpouts: Output[];
    turnOffTracking: () => void;
    consume: () => Output[];
  };
}

const withHttpClient = (http: HTTP | NullHttp): HTTPClient => {
  const emitter = new EventEmitter();
  return {
    requestAsync: async ({
      host,
      port,
      method,
      headers = {},
      path,
      body = "",
    }: Request) =>
      await new Promise((resolve, reject) => {
        const request: any = http.request({
          host,
          port,
          method,
          headers,
          path,
          body,
        });

        emitter.emit(REQUEST_EVENT, {
          host,
          port,
          method: method.toUpperCase(),
          headers: normalizeHeaders(headers),
          path,
          body,
        });

        request.on("response", (res: any) => {
          const headers = { ...res.headers };

          delete headers.connection;
          delete headers["content-length"];
          delete headers.host;
          delete headers.date;

          let body = "";
          res.on("data", (chunk = "") => {
            body += chunk;
          });

          res.on("end", () => {
            resolve({ status: res.statusCode, headers, body });
          });
        });

        request.end(body);
      }),

    trackRequests: () => trackOutput(emitter, REQUEST_EVENT),
  };
};

export const httpClient = {
  create: () => withHttpClient(http),
  createNull: (
    responses: ConfigurableResponses = {
      "/my-path": [
        {
          status: 503,
          body: "Null http client response",
          headers: { NullHttpClient: "default-header" },
        },
      ],
    }
  ) => withHttpClient(nullHttp(responses)),
};
