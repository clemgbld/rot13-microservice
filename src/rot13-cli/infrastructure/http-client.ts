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

interface ConfiguarbleResponse {
  status?: number;
  headers?: Record<string, string>;
  body?: string;
  hang?: boolean;
}

type ConfigurableResponses = Record<string, ConfiguarbleResponse[]>;

interface NullHttp {
  request: (request: Request) => EventEmitter;
}

class NullResponse extends EventEmitter {
  constructor(private _res: ConfiguarbleResponse = { status: 503, body: "" }) {
    super();
    setImmediate(() => {
      this.emit("data", this._res.body);
      if (!this._res.hang) this.emit("end");
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
  constructor(private _res: ConfiguarbleResponse[] = []) {
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
  request: ({ host, port, method, headers, path, body }: Request) => {
    responsePromise: Promise<Response>;
    cancelFn: (message: string) => boolean;
  };
  trackRequests: () => {
    outpouts: Output[];
    turnOffTracking: () => void;
    consume: () => Output[];
  };
}

const withHttpClient = (http: HTTP | NullHttp): HTTPClient => {
  const emitter = new EventEmitter();
  let cancelFn: (message: string) => boolean;
  return {
    request: ({
      host,
      port,
      method,
      headers = {},
      path,
      body = "",
    }: Request) => {
      const responsePromise: Promise<Response> = new Promise(
        (resolve, reject) => {
          const request: any = http.request({
            host,
            port,
            method,
            headers,
            path,
            body,
          });

          let cancellable = true;

          const requestData = {
            host,
            port,
            method: method.toUpperCase(),
            headers: normalizeHeaders(headers),
            path,
            body,
          };

          cancelFn = (message: string) => {
            if (!cancellable) return false;
            request.abort();
            request.destroy(reject(new Error(message)));
            cancellable = false;

            emitter.emit(REQUEST_EVENT, { ...requestData, cancelled: true });
            return true;
          };

          emitter.emit(REQUEST_EVENT, requestData);

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
              cancellable = false;
              resolve({ status: res.statusCode, headers, body });
            });
          });

          request.end(body);
        }
      );

      return { responsePromise, cancelFn };
    },

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
