import console from "console";
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
  method: string;
  body: string;
  path: string;
  headers: http.IncomingHttpHeaders;
}

const HOST = "localhost";
const PORT = 3274;

const createSpyServer = () => {
  const server = http.createServer();
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
            console.log(req.method);
            console.log(req.headers);
            console.log(body);
            console.log("send response");

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
  it("should ", async () => {
    const server = createSpyServer();
    await server.startAsync();

    try {
      await requestAsync({
        host: HOST,
        port: PORT,
        method: "POST",
        headers: { myRequestheader: "my value" },
        path: "/my-path",
        body: "my-body",
      });
    } finally {
      await server.stopAsync();
    }
  });
});
