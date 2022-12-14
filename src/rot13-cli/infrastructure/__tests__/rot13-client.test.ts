import { createRot13Client } from "../rot13-client";
import { httpClient } from "../http-client";

declare global {
  namespace jest {
    interface Matchers<R> {
      toNotBeAResolvedPromise: () => Promise<{
        pass: false;
        message: () => string;
      }>;
    }
  }
}

interface Response {
  status?: number;
  headers?: Record<string, string>;
  body?: string;
  hang?: boolean;
}

const VALID_TRANSFORME_TEXT = "transformed_text";
const HOST = "localhost";
const IRRELEVANT_PORT = 45;
const IRRELEVENAT_TEXT = "irrrelevant text";
const VALID_STATUS = 200;
const VALID_HEADERS = { "content-type": "application/json" };
const VALID_BODY = JSON.stringify({ transformed: VALID_TRANSFORME_TEXT });

export const createClient = ({
  status = VALID_STATUS,
  headers = VALID_HEADERS,
  body = VALID_BODY,
  hang = false,
}: Response) => {
  const client = httpClient.createNull({
    "/rot-13/transform": [
      {
        status,
        headers,
        body,
        hang,
      },
    ],
  });

  const { outpouts: requests } = client.trackRequests();

  return { client, requests };
};

describe("rot13 service client", () => {
  describe("Happy path", () => {
    it("make request", async () => {
      const { client, requests } = createClient({
        status: VALID_STATUS,
        headers: VALID_HEADERS,
        body: VALID_BODY,
      });

      const rot13Client = createRot13Client(client);

      await rot13Client.transform(9999, "text_to_transform").transformPromise;

      expect(requests).toEqual([
        {
          host: HOST,
          port: 9999,
          path: "/rot-13/transform",
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text: "text_to_transform" }),
        },
      ]);
    });

    it("parse the response", async () => {
      const { client } = createClient({
        status: VALID_STATUS,
        headers: VALID_HEADERS,
        body: VALID_BODY,
      });
      const rot13Client = createRot13Client(client);
      const res = await rot13Client.transform(IRRELEVANT_PORT, IRRELEVENAT_TEXT)
        .transformPromise;

      expect(res).toBe(VALID_TRANSFORME_TEXT);
    });
  });

  describe("Failure paths", () => {
    const expectFailure = async (
      {
        status = VALID_STATUS,
        headers = VALID_HEADERS,
        body = VALID_BODY,
      }: Response,
      message: string
    ) => {
      const { client } = createClient({
        status,
        headers,
        body,
      });

      const rot13Client = createRot13Client(client);

      await expect(
        () => rot13Client.transform(9999, IRRELEVENAT_TEXT).transformPromise
      ).rejects.toThrow(
        `${message}\nHost:${HOST}:9999\nStatus: ${status}\nHeaders: ${JSON.stringify(
          headers
        )}\nBody: ${body}`
      );
    };

    it("fails gracefully when the status code has an unexpected value", async () => {
      await expectFailure(
        { status: 400 },
        "Unexpected status from ROT 13 service"
      );
    });

    it("fails gracefully when body does not exist", async () => {
      await expectFailure({ body: "" }, "Body missing from ROT-13 service");
    });

    it("fails gracefully when the body is un parsable", async () => {
      await expectFailure(
        { body: "xxx" },
        "Unparsable body from ROT-13 service: Unexpected token x in JSON at position 0"
      );
    });

    it("should fails gracefully when the body has unexpected value", async () => {
      await expectFailure(
        { body: JSON.stringify({ foo: "bar" }) },
        "Unexpected body type from Rot-13 service: expected string but received undefined"
      );
    });

    it("does not fail when body have more field than we expect", async () => {
      const { client } = createClient({
        body: JSON.stringify({ transformed: "response", foo: "bar" }),
      });

      const rot13Client = createRot13Client(client);

      const res = await rot13Client.transform(IRRELEVANT_PORT, IRRELEVENAT_TEXT)
        .transformPromise;

      expect(res).toBe("response");
    });

    it("tracks requests", async () => {
      const { client } = createClient({});

      const rot13Client = createRot13Client(client);

      const { outpouts: requests } = rot13Client.trackRequests();

      await rot13Client.transform(9999, "my text").transformPromise;

      expect(requests).toEqual([
        {
          port: 9999,
          text: "my text",
        },
      ]);
    });

    it("simulates hangs", async () => {
      const { client } = createClient({ hang: true });

      const rot13Client = createRot13Client(client);

      const responsePromise = rot13Client.transform(
        9999,
        "my text"
      ).transformPromise;

      await expect(responsePromise).toNotBeAResolvedPromise();
    });

    it("can cancel request", async () => {
      const { client, requests } = createClient({ hang: true });

      const rot13Client = createRot13Client(client);

      const { cancelFn, transformPromise } = rot13Client.transform(
        9999,
        "my text"
      );

      cancelFn();

      await expect(async () => await transformPromise).rejects.toThrow(
        "Rot13 request cancelled\nendpoint: /rot-13/transform"
      );

      expect(requests).toEqual([
        {
          host: "localhost",
          port: 9999,
          method: "POST",
          headers: { "content-type": "application/json" },
          path: "/rot-13/transform",
          body: '{"text":"my text"}',
        },
        {
          host: "localhost",
          port: 9999,
          method: "POST",
          headers: { "content-type": "application/json" },
          path: "/rot-13/transform",
          body: '{"text":"my text"}',
          cancelled: true,
        },
      ]);
    });

    it("can tracks requests that are cancel", async () => {
      const { client } = createClient({ hang: true });

      const rot13Client = createRot13Client(client);

      const { outpouts: requests } = rot13Client.trackRequests();

      const { cancelFn, transformPromise } = rot13Client.transform(
        9999,
        "my text"
      );

      cancelFn();

      try {
        await transformPromise;
      } catch (err) {}

      expect(requests).toEqual([
        { port: 9999, text: "my text" },
        { port: 9999, text: "my text", cancelled: true },
      ]);
    });

    it("does not track request after response receive", async () => {
      const { client } = createClient({});

      const rot13Client = createRot13Client(client);

      const { outpouts: requests } = rot13Client.trackRequests();

      const { cancelFn, transformPromise } = rot13Client.transform(
        9999,
        "my text"
      );

      await transformPromise;

      cancelFn();

      expect(requests).toEqual([{ port: 9999, text: "my text" }]);
    });
  });
});
