import http from "http";
import { httpClient, HTTPClient } from "../http-client";

declare global {
  namespace jest {
    interface Matchers<R> {
      toNotBeAResolvedPromise: () => Promise<{
        pass: false;
        message: () => string;
      }>;
    }
  }
}

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
  hang?: boolean;
}

const HOST = "localhost";
const PORT = 3287;

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

            if (!nextResponse.hang) res.end(nextResponse.body);
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

const IRELEVENAT_REQUEST = {
  host: HOST,
  port: PORT,
  method: "GET",
  path: "/my-path",
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

  const makeRequestAsync = async ({
    host = HOST,
    port = PORT,
    method = "post",
    headers,
    body,
    path = "/my-path",
  }: {
    host?: string;
    port?: number;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    path?: string;
  }) => {
    const client = httpClient.create();
    const response = client.request({
      host,
      port,
      method,
      headers,
      body,
      path,
    });

    return await response.responsePromise;
  };

  const makeNullRequestAsync = async ({
    client = httpClient.createNull(),
    host = HOST,
    port = PORT,
    method = "post",
    headers,
    body,
    path = "/my-path",
  }: {
    client?: HTTPClient;
    host?: string;
    port?: number;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    path?: string;
  }) => {
    const response = client.request({
      host,
      port,
      method,
      headers,
      body,
      path,
    });

    return await response.responsePromise;
  };

  describe("Real implementation", () => {
    it("performs request and returns a response", async () => {
      server.setResponse({
        status: 999,
        headers: { myRequestHeader: "my value" },
        body: "my-body",
      });

      const response = await makeRequestAsync({
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
      await makeRequestAsync({
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
    it("does not talk to network", async () => {
      await makeNullRequestAsync(IRELEVENAT_REQUEST);

      expect(server.getLastRequest()).toBe(null);
    });

    it("provides a default response", async () => {
      const response = await makeNullRequestAsync(IRELEVENAT_REQUEST);

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
          { status: 404, body: "" },
        ],
        "/endpoint/2": [{ status: 301, body: "endpoint 2 body" }],
      });

      const response1A = await makeNullRequestAsync({
        client,
        host: HOST,
        port: PORT,
        method: "GET",
        path: "/endpoint/1",
      });

      const response1B = await makeNullRequestAsync({
        client,
        host: HOST,
        port: PORT,
        method: "GET",
        path: "/endpoint/1",
      });

      const response2A = await makeNullRequestAsync({
        client,
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
      await makeNullRequestAsync({
        client,
        host: HOST,
        port: PORT,
        method: "post",
        headers: { myHeAders: "my value" },
        body: "my body",
        path: "/my-path",
      });

      expect(requests).toEqual([
        {
          body: "my body",
          host: HOST,
          port: PORT,
          method: "POST",
          headers: { myheaders: "my value" },
          path: "/my-path",
        },
      ]);
    });
  });

  it("simulates hangs", async () => {
    const client = httpClient.createNull({
      "/endpoint": [{ hang: true }],
    });

    const request = makeNullRequestAsync({
      client,
      host: HOST,
      port: PORT,
      method: "post",
      headers: { myheaders: "my value" },
      body: "my body",
      path: "/endpoint",
    });

    await expect(request).toNotBeAResolvedPromise();
  });

  describe("cancellation", () => {
    it("can cancel request", async () => {
      server.setResponse({ hang: true, status: 200, headers: {} });

      const client = httpClient.create();

      const { responsePromise, cancelFn } = client.request(IRELEVENAT_REQUEST);

      const cancelled = cancelFn("my cancel message");

      expect(cancelled).toBe(true);

      await expect(async () => {
        await responsePromise;
      }).rejects.toThrow("my cancel message");
    });

    it("ignores additional request to cancel", async () => {
      server.setResponse({ hang: true, status: 200, headers: {} });

      const client = httpClient.create();

      const { responsePromise, cancelFn } = client.request(IRELEVENAT_REQUEST);
      cancelFn("first cancel");
      const cancelled = cancelFn("second cancel");

      await expect(async () => {
        await responsePromise;
      }).rejects.toThrow("first cancel");

      expect(cancelled).toBe(false);
    });

    it("ignores cancellation after response has already been received", async () => {
      server.setResponse({ status: 200, headers: {} });

      const client = httpClient.create();

      const { responsePromise, cancelFn } = client.request(IRELEVENAT_REQUEST);

      await responsePromise;

      const cancelled = cancelFn(
        "should not work when the response is already received"
      );

      expect(cancelled).toBe(false);
    });

    it("tracks request that are cancelled", async () => {
      server.setResponse({ hang: true, status: 200, headers: {} });

      const client = httpClient.create();

      const { outpouts: requests } = client.trackRequests();

      const { responsePromise, cancelFn } = client.request(IRELEVENAT_REQUEST);

      cancelFn("cancel request");
      try {
        await responsePromise;
      } catch (err) {}
      expect(requests).toEqual([
        {
          host: "localhost",
          port: 3287,
          method: "GET",
          headers: {},
          path: "/my-path",
          body: "",
        },

        {
          host: "localhost",
          port: 3287,
          method: "GET",
          headers: {},
          path: "/my-path",
          body: "",
          cancelled: true,
        },
      ]);
    });

    it("does not track request that occurs after response", async () => {
      server.setResponse({ status: 200, headers: {} });

      const client = httpClient.create();

      const { outpouts: requests } = client.trackRequests();

      const { responsePromise, cancelFn } = client.request(IRELEVENAT_REQUEST);

      await responsePromise;

      cancelFn("cancel request");

      expect(requests).toEqual([
        {
          host: "localhost",
          port: 3287,
          method: "GET",
          headers: {},
          path: "/my-path",
          body: "",
        },
      ]);
    });
  });

  describe("nullability", () => {
    it("cancel request", async () => {
      const client = httpClient.createNull({
        "/endpoint": [{ hang: true, status: 200 }],
      });

      const { responsePromise, cancelFn } = client.request(IRELEVENAT_REQUEST);

      cancelFn("cancel request");

      await expect(async () => await responsePromise).rejects.toThrow(
        "cancel request"
      );
    });
  });
});
