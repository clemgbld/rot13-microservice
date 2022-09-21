import { httpServer } from "../http-server";
import { requestAsync } from "../../test-helper/helper";
import { httpRequest, HttpRequest } from "../http-request";
const PORT = 3541;

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
  describe("Raw data", () => {
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

  describe("cooked content type header", () => {
    const check = ({
      contentType = "application/json",
      mediaType = "application/json",
      expectedResult = true,
      contentTypeKey = "content-type",
    }) => {
      const headers = { [contentTypeKey]: contentType };
      const request = httpRequest.createNull({ headers });
      expect(request.hasContentType(mediaType)).toBe(expectedResult);
    };

    it("checks if expected mediaty matchs contentype headers", () => {
      check({
        contentType: "application/json",
        mediaType: "application/json",
        expectedResult: true,
      });
    });

    it("checks that media type does not match ", () => {
      check({
        contentType: "text/plain",
        mediaType: "application/json",
        expectedResult: false,
      });
    });

    it("should be case insensitive when contentype is upperCase", () => {
      check({
        contentType: "APPLICATION/JSON",
        mediaType: "application/json",
        expectedResult: true,
      });
    });

    it("should be case insensitive when mediaType is upperCase", () => {
      check({
        contentType: "application/json",
        mediaType: "APPLICATION/JSON",
        expectedResult: true,
      });
    });

    it("should be false when there is no conetnt type", () => {
      check({
        contentType: "APPLICATION/JSON",
        mediaType: "application/json",
        expectedResult: false,
        contentTypeKey: "no",
      });
    });

    it("should ignores white spaces", () => {
      check({
        contentType: "  application/json  ",
        mediaType: "\tapplication/json\t",
        expectedResult: true,
      });
    });

    it("should ignore parameters", () => {
      check({
        contentType: "application/json;charset=utf-8;foo=bar",
        mediaType: "application/json",
        expectedResult: true,
      });
    });
  });
});

describe("nullability", () => {
  it("provides default values", async () => {
    const request = httpRequest.createNull();
    expect(request.url).toBe("/my-null-url");
    expect(request.method).toBe("GET");
    expect(request.headers).toEqual({});
    expect(await request.readBodyAsync()).toEqual("");
  });

  it("can configure the url", () => {
    const request = httpRequest.createNull({ url: "/my-url" });
    expect(request.url).toBe("/my-url");
  });

  it("can configure method (and normalize case)", () => {
    const request = httpRequest.createNull({ method: "pOst" });
    expect(request.method).toBe("POST");
  });

  it("can configure headers (and normalize case)", () => {
    const request = httpRequest.createNull({
      headers: {
        mYHeader1: "myvalue1",
        MYheader2: "myvalue2",
      },
    });

    expect(request.headers).toEqual({
      myheader1: "myvalue1",
      myheader2: "myvalue2",
    });
  });

  it("can configure the body", async () => {
    const request = httpRequest.createNull({ body: "my body" });
    expect(await request.readBodyAsync()).toBe("my body");
  });

  it("fails fast when body is read twice", async () => {
    const request = httpRequest.createNull();
    await request.readBodyAsync();
    await expect(
      async () => await request.readBodyAsync()
    ).rejects.toThrowError("Cannot read the body twice");
  });
});
