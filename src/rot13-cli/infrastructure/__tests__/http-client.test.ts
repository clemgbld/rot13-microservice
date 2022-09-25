import http from "http";

interface Request {
  host: string;
  port: number;
  method: string;
  headers: Record<string, string>;
  path: string;
  body: string;
}

interface LastRequest {
  method?: string;
  body: string;
  path?: string;
  headers: http.IncomingHttpHeaders;
}

const HOST = "localhost";
const PORT = 3274;

const createSpyServer = () => {
  const server = http.createServer();
  let lastRequest: LastRequest;
  return {
    startAsync: async () =>
      new Promise((resolve, reject) => {
        console.log("starting server");
        server.once("listening", () => {
          resolve("resolve");
        });

        server.on("request", (req, res) => {
          console.log("receiving request");

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

            res.end();
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
  };
};

const requestAsync = async ({
  host,
  port,
  method,
  headers,
  path,
  body,
}: Request) =>
  await new Promise((resolve, reject) => {
    const request = http.request({
      host,
      port,
      method,
      headers,
      path,
    });

    request.end(body);

    request.on("response", (res) => {
      res.resume();

      resolve("response");
    });
  });

describe("HTTP client", () => {
  it("performs request", async () => {
    const server = createSpyServer();
    await server.startAsync();

    try {
      await requestAsync({
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
    } finally {
      await server.stopAsync();
    }
  });
});
