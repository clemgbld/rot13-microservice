import http from "http";
import { buildInfrastructure } from "./utils/buildInfrastructure";

export interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  readBodyAsync: () => Promise<string>;
}

const withHttpRequest =
  (dependencyHttpRequest: http.IncomingMessage) => (o: any) => {
    return {
      ...o,
      url: dependencyHttpRequest.url,
      method: dependencyHttpRequest.method,
      headers: Object.freeze(dependencyHttpRequest.headers),
      readBodyAsync: async () => {
        return await new Promise((resolve, reject) => {
          if (dependencyHttpRequest.readableEnded) {
            throw new Error("Cannot read the body twice");
          }
          dependencyHttpRequest.on("error", reject);
          let body = "";
          dependencyHttpRequest.on("data", (chunk: string) => {
            body += chunk;
          });
          dependencyHttpRequest.on("end", () => {
            resolve(body);
          });
        });
      },
    };
  };

export const httpRequest = {
  create: (request: http.IncomingMessage) =>
    buildInfrastructure({
      dependancy: request,
      infrastructureObj: httpRequest,
      withMixin: withHttpRequest,
    }),
};
