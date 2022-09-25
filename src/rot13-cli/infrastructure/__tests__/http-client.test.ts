import http from "http";
import { httpClient } from "../http-client";

interface Server {
  startAsync: () => Promise<unknown>;
  stopAsync: () => Promise<unknown>;
  getLastRequest: () => LastRequest | null;
  setResponse: (response: Response) => void;
  reset: () => void;
}

interface LastRequest {
  method?: string;
  body: string;
  path?: string;
  headers: http.IncomingHttpHeaders;
}

interface Response {
  status: number;
  headers: Record<string, string>;
  body?: string;
}

const HOST = "localhost";
const PORT = 3274;

const createSpyServer = () => {
  const server = http.createServer();
  let lastRequest: LastRequest | null;
  let nextResponse: Response;
  return {
    startAsync: async () =>
      new Promise((resolve, reject) => {
        server.once("listening", () => {
          resolve("resolve");
        });

        server.on("request", (req, res) => {
          let body = "";

          req.on("data", (chunk: string) => {
            body += chunk;
          });

          req.on("end", () => {
            const headers = { ...req.headers };

            delete headers.connection;
            delete headers["content-length"];
            delete headers.host;

            lastRequest = {
              path: req.url,
              method: req.method,
              headers,
              body,
            };

            res.statusCode = nextResponse.status;
            Object.entries(nextResponse.headers).forEach(([key, value]) => {
              res.setHeader(key, value);
            });

            res.end(nextResponse.body);
          });
        });

        server.listen(PORT);
      }),

    stopAsync: async () =>
      new Promise((resolve, reject) => {
        console.log("stopping server");
        server.once("close", () => resolve("close"));
        server.close();
      }),
    getLastRequest: () => lastRequest,
    setResponse: (response: Response) => {
      nextResponse = response;
    },
    reset: () => {
      lastRequest = null;
      nextResponse = {
        status: 500,
        headers: { header: "header not specci" },
        body: "no body specified yet",
      };
    },
  };
};

describe("HTTP client", () => {
  let server: Server;

  beforeAll(async () => {
    server = createSpyServer();
    await server.startAsync();
  });

  beforeEach(() => {
    server.reset();
  });

  afterAll(async () => {
    await server.stopAsync();
  });

  it("performs request and returns a response", async () => {
    const client = httpClient.create();

    server.setResponse({
      status: 999,
      headers: { myRequestHeader: "my value" },
      body: "my-body",
    });

    const response = await client.requestAsync({
      host: HOST,
      port: PORT,
      method: "POST",
      headers: { myRequestHeader: "my value" },
      path: "/my-path",
      body: "my-body",
    });
    expect(server.getLastRequest()).toEqual({
      method: "POST",
      headers: { myrequestheader: "my value" },
      path: "/my-path",
      body: "my-body",
    });

    expect(response).toEqual({
      status: 999,
      headers: { myrequestheader: "my value" },
      body: "my-body",
    });
  });
});
