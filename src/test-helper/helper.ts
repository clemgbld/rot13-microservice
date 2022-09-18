import http from "http";

interface RequestAsync {
  port: number;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string[];
}

export const requestAsync = async ({
  port,
  url,
  method,
  headers,
  body,
}: RequestAsync) => {
  return await new Promise((resolve, reject) => {
    if (method === undefined && body?.length !== 0) method = "POST";

    const request = http.request({ port, path: url, method, headers });
    body?.forEach((chunk) => request.write(chunk));
    request.end();

    request.on("response", (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("error", (err) => reject(err));
      response.on("end", () => {
        const headers = response.headers;
        delete headers.connection;
        delete headers["content-length"];
        delete headers.date;

        resolve({
          status: response.statusCode,
          headers: response.headers,
          body,
        });
      });
    });
  });
};
