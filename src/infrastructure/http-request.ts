import http from "http";
import { buildInfrastructure } from "./utils/buildInfrastructure";

const withHttpRequest =
  (dependencyHttpRequest: http.IncomingMessage) => (o: any) => {
    return {
      ...o,
      url: dependencyHttpRequest.url,
      method: dependencyHttpRequest.method,
      headers: Object.freeze(dependencyHttpRequest.headers),
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
