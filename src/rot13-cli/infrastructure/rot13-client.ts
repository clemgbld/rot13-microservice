import EventEmitter from "events";
import { pipe } from "ramda";
import { HTTPClient, Response } from "./http-client";
import { trackOutput } from "../../infrastructure/utils/trackOutput";

const HOST = "localhost";

const REQUEST_EVENT = "REQUEST_EVENT";

const responseErrorBuilder =
  ({ res, port }: { res: Response; port: number }) =>
  (message: string) => {
    throw new Error(
      `${message}\nHost:${HOST}:${port}\nStatus: ${
        res.status
      }\nHeaders: ${JSON.stringify(res.headers)}\nBody: ${res.body}`
    );
  };

const validateResponse = ({ port, res }: { port: number; res: Response }) => {
  const throwResponseError = responseErrorBuilder({ port, res });

  if (res.status !== 200)
    throwResponseError("Unexpected status from ROT 13 service");

  if (res.body === "") throwResponseError("Body missing from ROT-13 service");

  return {
    throwResponseError,
    body: res.body,
  };
};

const parseBody = ({
  throwResponseError,
  body,
}: {
  throwResponseError: (message: string) => never;
  body: string;
}) => {
  try {
    const parsedBody = JSON.parse(body).transformed;

    if (typeof parsedBody !== "string")
      throwResponseError(
        `Unexpected body type from Rot-13 service: expected string but received ${typeof parsedBody}`
      );

    return parsedBody;
  } catch ({ message }) {
    throwResponseError(`Unparsable body from ROT-13 service: ${message}`);
  }
};

const validateAndParseResponse = pipe(validateResponse, parseBody);

export const createRot13Client = (client: HTTPClient) => {
  const emitter = new EventEmitter();
  return {
    transformAsync: async (port: number, textToTransform: string) => {
      const res = await client.requestAsync({
        host: HOST,
        port,
        path: "/rot-13/transform",
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: textToTransform }),
      });
      emitter.emit(REQUEST_EVENT, {
        port,
        text: textToTransform,
      });

      return validateAndParseResponse({ port, res });
    },
    trackRequests: () => trackOutput(emitter, REQUEST_EVENT),
  };
};
