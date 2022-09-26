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
  headers?: http.IncomingHttpHeaders;
}

export interface Response {
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

  describe.skip("Real implementation", () => {
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

    it("does not require headers and body", async () => {
      const client = httpClient.create();
      await client.requestAsync({
        host: HOST,
        port: PORT,
        method: "GET",
        path: "/my-path",
      });

      expect(server.getLastRequest()).toEqual({
        method: "GET",
        path: "/my-path",
        headers: {},
        body: "",
      });
    });
  });

  describe("nullability", () => {
    const IRELEVENAT_REQUEST = {
      host: HOST,
      port: PORT,
      method: "GET",
      path: "/my-path",
    };
    it("does not talk to network", async () => {
      const client = httpClient.createNull();
      await client.requestAsync(IRELEVENAT_REQUEST);

      expect(server.getLastRequest()).toBe(null);
    });

    it("provides a default response", async () => {
      const client = httpClient.createNull();

      const response = await client.requestAsync(IRELEVENAT_REQUEST);

      expect(response).toEqual({
        status: 503,
        headers: { NullHttpClient: "default-header" },
        body: "Null http client response",
      });
    });

    it("provides multiple responses from multiple endpoints", async () => {
      const client = httpClient.createNull({
        "/endpoint/1": [
          { status: 200, headers: { myHeader: "my value" }, body: "body" },
          { status: 404 },
        ],
        "/endpoint/2": [{ status: 301, body: "endpoint 2 body" }],
      });

      const response1A = await client.requestAsync({
        host: HOST,
        port: PORT,
        method: "GET",
        path: "/endpoint/1",
      });

      const response1B = await client.requestAsync({
        host: HOST,
        port: PORT,
        method: "GET",
        path: "/endpoint/1",
      });

      const response2A = await client.requestAsync({
        host: HOST,
        port: PORT,
        method: "GET",
        path: "/endpoint/2",
      });

      expect(response1A).toEqual({
        status: 200,
        headers: { myHeader: "my value" },
        body: "body",
      });

      expect(response1B).toEqual({
        status: 404,
        headers: {},
        body: "",
      });

      expect(response2A).toEqual({
        status: 301,
        body: "endpoint 2 body",
        headers: {},
      });
    });

    it("tracks request", async () => {
      const client = httpClient.createNull();
      const { outpouts: requests } = client.trackRequests();
      await client.requestAsync({
        host: HOST,
        port: PORT,
        method: "post",
        headers: { myHeAders: "my value" },
        body: "my body",
        path: "/my-path",
      });

      expect(requests).toEqual([
        {
          host: HOST,
          port: PORT,
          method: "POST",
          headers: { myheaders: "my value" },
          path: "/my-path",
        },
      ]);
    });
  });
});
