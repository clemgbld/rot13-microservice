import { commandLine, nullProcess } from "../../infrastructure/command-line";
import { httpServer } from "../../infrastructure/http-server";
import { httpRequest } from "../../infrastructure/http-request";
import { rot13 } from "../../core/rot13";
import { app } from "../rot13-server";

interface Response {
  status: number;
  headers: Record<string, string>;
  body: string;
}

interface SimulateRequest {
  url?: string;
  body?: string | Record<string, string>;
  method?: string;
  headers?: Record<string, string>;
}

const startServerAsync = async (args: string[] = ["5000"]) => {
  const nullCommandLine = commandLine(nullProcess(args));
  const nullHttpServer = httpServer.createNull();
  const myApp = app(nullCommandLine, nullHttpServer);
  await myApp.startAsync();

  return { nullCommandLine, nullHttpServer };
};

const VALID_URL = "/rot-13/transform";
const VALID_METHOD = "POST";

const simulateRequestAsync = async ({
  url = VALID_URL,
  body = { text: "" },
  method = VALID_METHOD,
  headers = { "Content-Type": "application/json;charset=utf-8" },
}: SimulateRequest) => {
  const { nullCommandLine, nullHttpServer } = await startServerAsync();

  const request = httpRequest.createNull({
    url,
    body: typeof body === "object" ? JSON.stringify(body) : body,
    method,
    headers,
  });
  const response = await nullHttpServer.simulateRequest(request);

  return { nullCommandLine, response };
};

const expectResponseToEqual = ({
  status,
  value,
  response,
}: {
  status: number;
  value: Record<string, string> | string;
  response: Response;
}) =>
  expect(response).toEqual({
    status,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(value),
  });

describe("ROT13-Server", () => {
  it("starts the server", async () => {
    const { nullCommandLine, nullHttpServer } = await startServerAsync([
      "5000",
    ]);
    expect(nullHttpServer.isStarted()).toBe(true);
    expect(nullCommandLine.getLastOutpout()).toBe(
      "Server started on port 5000\n"
    );
  });

  it("logs 'Recieved request' to the command-line when request is received", async () => {
    const { nullCommandLine } = await simulateRequestAsync({});
    expect(nullCommandLine.getLastOutpout()).toBe("Recevied request\n");
  });

  it("transforms request", async () => {
    const { response } = await simulateRequestAsync({
      url: VALID_URL,
      body: { text: "hello" },
    });

    expectResponseToEqual({
      response,
      status: 200,
      value: { transformed: rot13("hello") },
    });
  });

  it("returns not found when the url is nor correct", async () => {
    const { response } = await simulateRequestAsync({
      url: "/no-such-url",
    });

    expectResponseToEqual({
      response,
      status: 404,
      value: { error: "Not found" },
    });
  });

  it("should give method not allowed when the method is not POST", async () => {
    const { response } = await simulateRequestAsync({
      method: "GET",
    });

    expectResponseToEqual({
      response,
      status: 405,
      value: { error: "Method not allowed" },
    });
  });

  it("should give bad request when content-type is not Json", async () => {
    const headers = { "Content-Type": "text/plain" };
    const { response } = await simulateRequestAsync({
      headers,
    });

    expectResponseToEqual({
      response,
      status: 405,
      value: { error: "Invalid content type" },
    });
  });

  it("should give bad request when there is no headers", async () => {
    const headers = {};
    const { response } = await simulateRequestAsync({
      headers,
    });

    expectResponseToEqual({
      response,
      status: 405,
      value: { error: "Invalid content type" },
    });
  });

  it("should give bad request when json does not have text field", async () => {
    const { response } = await simulateRequestAsync({
      body: { notText: "" },
    });

    expectResponseToEqual({
      response,
      status: 400,
      value: { error: "Json must have text field" },
    });
  });

  it("ignores extranous fields", async () => {
    const body = { wrongField: "foo", text: "right field" };
    const { response } = await simulateRequestAsync({
      body,
    });
    expectResponseToEqual({
      response,
      status: 200,
      value: { transformed: rot13("right field") },
    });
  });

  describe("Command-line processing", () => {
    it("should tell the user to provide an argument when the user do not", async () => {
      const { nullCommandLine } = await startServerAsync([]);
      expect(nullCommandLine.getLastOutpout()).toBe(
        "please provide an argument\n"
      );
    });

    it("should tell the user when he provide too much argument", async () => {
      const { nullCommandLine } = await startServerAsync(["one", "two"]);
      expect(nullCommandLine.getLastOutpout()).toBe(
        "please provide at most one argument\n"
      );
    });
  });
});

describe("parsing", () => {
  it("should give bad request when json fails to parse", async () => {
    const { response } = await simulateRequestAsync({ body: "not-json" });
    expect(response).toEqual({
      status: 400,
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: '{"error":"Unexpected token o in JSON at position 1"}',
    });
  });
});
