import EventEmitter from "events";
import { pipe } from "ramda";
import { HTTPClient, Response } from "./http-client";
import { trackOutput, Output } from "../../infrastructure/utils/trackOutput";

const HOST = "localhost";

const REQUEST_EVENT = "REQUEST_EVENT";

const END_POINT = "/rot-13/transform";

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

const validateAndParseResponseAsync = async ({
  responsePromise,
  port,
}: {
  responsePromise: Promise<Response>;
  port: number;
}) => validateAndParseResponse({ port, res: await responsePromise });

export interface Rot13Client {
  transform: (
    port: number,
    textToTransform: string
  ) => { transformPromise: Promise<any> };
  trackRequests: () => {
    outpouts: Output[];
    turnOffTracking: () => void;
    consume: () => Output[];
  };
}

export const createRot13Client = (client: HTTPClient) => {
  const emitter = new EventEmitter();
  return {
    transform: (port: number, textToTransform: string) => {
      const requestData = {
        port,
        text: textToTransform,
      };

      const { responsePromise, cancelFn: httpClientCancelFn } = client.request({
        host: HOST,
        port,
        path: END_POINT,
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: textToTransform }),
      });
      emitter.emit(REQUEST_EVENT, requestData);

      const transformPromise = validateAndParseResponseAsync({
        port,
        responsePromise,
      });

      const cancelFn = () => {
        const cancelled = httpClientCancelFn(
          `Rot13 request cancelled\nendpoint: ${END_POINT}`
        );

        if (cancelled)
          emitter.emit(REQUEST_EVENT, { ...requestData, cancelled: true });
      };

      return { transformPromise, cancelFn };
    },
    trackRequests: () => trackOutput(emitter, REQUEST_EVENT),
  };
};
