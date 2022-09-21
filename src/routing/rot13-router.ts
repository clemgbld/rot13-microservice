import { pipe } from "ramda";
import {
  validResponse,
  notFound,
  methodNotAllowed,
  invalidContentType,
  badRequest,
} from "./rot13-response";
import { rot13 } from "../core/rot13";
import { RequestAdapter } from "../infrastructure/http-request";

const postValidTransformedRes = pipe(rot13, validResponse);

export const routeAsync = async (request: RequestAdapter) => {
  if (request.pathName !== "/rot-13/transform") return notFound();
  if (request.method !== "POST") return methodNotAllowed();
  if (!request.hasContentType("application/json")) return invalidContentType();

  const input = await request.readBodyAsync();
  const jsonString = input;

  try {
    const json = JSON.parse(jsonString);
    if (!json.text) {
      throw new Error("Json must have text field");
    }
    return postValidTransformedRes(json.text);
  } catch (err: any) {
    return badRequest(err.message);
  }
};
