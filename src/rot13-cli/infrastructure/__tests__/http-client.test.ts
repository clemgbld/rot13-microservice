import console from "console";
import http from "http";

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

describe("HTTP client", () => {
  it("should ", async () => {
    const server = createSpyServer();
    await server.startAsync();
    const host = HOST;
    const port = PORT;
    const method = "POST";
    const headers = { myRequestheader: "my value" };
    const path = "/my-path";
    try {
      await new Promise((resolve, reject) => {
        const request = http.request({
          host,
          port,
          method,
          headers,
          path,
        });

        request.end("my request body");

        request.on("response", (res) => {
          res.resume();

          resolve("response");
        });
      });
    } finally {
      await server.stopAsync();
    }
  });
});
