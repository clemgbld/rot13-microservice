import http from "http";
import { httpServer } from "../http-server";
import { requestAsync } from "../../test-helper/helper";

const PORT = 3127;

interface Options {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
}

type ExpectFnAsync = (request: http.IncomingMessage) => void;

const createRequestAsync = (options: Options, expectFnAsync: ExpectFnAsync) =>
  new Promise(async (resolve, reject) => {
    const onRequestAsync = async (request: http.IncomingMessage) => {
      try {
        expectFnAsync(request);
        return { status: 200, headers: {}, body: "" };
      } catch (err) {
        reject(err);
      }
    };

    const server = httpServer.create();

    await server.startAsync({
      port: PORT,
      onRequestAsync,
    });

    await requestAsync({ port: PORT, ...options });

    await server.stopAsync();

    resolve("resolve");
  });

describe("HTTP Request", () => {
  it("provides the url", async () => {
    await createRequestAsync(
      {
        url: "/my-url",
      },
      (request: http.IncomingMessage) => expect(request.url).toBe("/my-url")
    );
  });

  it("provides the method (and normalized case)", async () => {
    await createRequestAsync(
      {
        method: "pOst",
      },
      (request: http.IncomingMessage) => expect(request.method).toBe("POST")
    );
  });

  it("provides the headers (and normalized case)", async () => {
    const headers: Record<string, string> = {
      myHeaDer1: "myHeader1",
      myHEader2: "myHeader2",
    };

    await createRequestAsync({ headers }, (request: http.IncomingMessage) => {
      expect(request.headers).toEqual({
        myheader1: "myHeader1",
        myheader2: "myHeader2",
        connection: "close",
        "content-length": "0",
        host: `localhost:${PORT}`,
      });
    });
  });

  it("should throw an error when trying to mutate the headers", async () => {
    const headers: Record<string, string> = {
      header: "value",
    };

    await createRequestAsync({ headers }, (request: http.IncomingMessage) => {
      try {
        delete request.headers.header;
      } catch (err: any) {
        expect(err.message).toBe(
          "Cannot delete property 'header' of [object Object]"
        );
      }
    });
  });
});
