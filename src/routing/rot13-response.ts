interface Response {
  status: number;
  value: Record<string, string>;
}

const response = ({ status, value }: Response) => ({
  status: status,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  body: JSON.stringify(value),
});

export const errorResponse = ({
  status,
  error,
}: {
  status: number;
  error: string;
}) => response({ status, value: { error } });

export const notFound = () =>
  errorResponse({ status: 404, error: "Not found" });

export const methodNotAllowed = () =>
  errorResponse({ status: 405, error: "Method not allowed" });

export const validResponse = (outpout: string) =>
  response({ status: 200, value: { transformed: outpout } });

export const invalidContentType = () =>
  errorResponse({ status: 405, error: "Invalid content type" });

export const badRequest = (error: string) =>
  errorResponse({ status: 400, error });
