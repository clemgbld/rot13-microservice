import http from "http";

interface Request {
  host: string;
  port: number;
  method: string;
  headers?: Record<string, string>;
  path: string;
  body?: string;
}

const withHttpClient = () => ({
  requestAsync: async ({ host, port, method, headers, path, body }: Request) =>
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

        const headers = { ...res.headers };

        delete headers.connection;
        delete headers["content-length"];
        delete headers.host;
        delete headers.date;

        let body = "";
        res.on("data", (chunk: string) => {
          body += chunk;
        });

        res.on("end", () => {
          resolve({ status: res.statusCode, headers, body });
        });
      });
    }),
});

export const httpClient = {
  create: () => withHttpClient(),
};
