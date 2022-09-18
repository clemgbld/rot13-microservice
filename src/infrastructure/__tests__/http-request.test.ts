import { httpServer } from "../http-server";
import { requestAsync } from "../../test-helper/helper";
import { HttpRequest } from "../http-request";
const PORT = 3157;

interface Options {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string[];
}

type ExpectFnAsync = (request: HttpRequest) => void;

const createRequestAsync = (options: Options, expectFnAsync: ExpectFnAsync) =>
  new Promise(async (resolve, reject) => {
    const onRequestAsync = async (request: HttpRequest) => {
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
      (request: HttpRequest) => expect(request.url).toBe("/my-url")
    );
  });

  it("provides the method (and normalized case)", async () => {
    await createRequestAsync(
      {
        method: "pOst",
      },
      (request: HttpRequest) => expect(request.method).toBe("POST")
    );
  });

  it("provides the headers (and normalized case)", async () => {
    const headers: Record<string, string> = {
      myHeaDer1: "myHeader1",
      myHEader2: "myHeader2",
    };

    await createRequestAsync({ headers }, (request: HttpRequest) => {
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

    await createRequestAsync({ headers }, (request: HttpRequest) => {
      try {
        delete request.headers.header;
      } catch (err: any) {
        expect(err.message).toBe(
          "Cannot delete property 'header' of [object Object]"
        );
      }
    });
  });

  it("provides body", async () => {
    const body = ["chunk1", "chunk2"];

    await createRequestAsync(
      {
        body,
      },
      async (request: HttpRequest) =>
        expect(await request.readBodyAsync()).toBe("chunk1chunk2")
    );
  });

  it("fails fast when the body is read twice", async () => {
    const body = ["chunk1", "chunk2"];
    await createRequestAsync(
      {
        body,
      },
      async (request: HttpRequest) => {
        await request.readBodyAsync();
        await expect(
          async () => await request.readBodyAsync()
        ).rejects.toThrowError("Cannot read the body twice");
      }
    );
  });
});
