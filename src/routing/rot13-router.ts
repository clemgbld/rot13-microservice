import {
  validResponse,
  notFound,
  methodNotAllowed,
  invalidContentType,
  badRequest,
} from "./rot13-response";
import { rot13 } from "../core/rot13";
import { RequestAdapter } from "../infrastructure/http-request";

export const routeAsync = async (request: RequestAdapter) => {
  if (request.url !== "/rot-13/transform") return notFound();
  if (request.method !== "POST") return methodNotAllowed();
  if (
    !request.headers["Content-Type".toLowerCase()]?.includes("application/json")
  )
    return invalidContentType();

  const input = await request.readBodyAsync();
  const jsonString = input;

  try {
    const json = JSON.parse(jsonString);
    if (!json.text) {
      throw new Error("Json must have text field");
    }
    return validResponse(rot13(json.text));
  } catch (err: any) {
    return badRequest(err.message);
  }
};
