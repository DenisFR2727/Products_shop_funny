import { once } from "node:events";
import { createServer, type Server } from "node:http";

import type { Express } from "express";

export type TestServer = {
  baseUrl: string;
  close: () => Promise<void>;
};

export async function startTestServer(app: Express): Promise<TestServer> {
  const server: Server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Failed to resolve test server address");
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}

export async function requestJson<T>(
  baseUrl: string,
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; body: T }> {
  const response = await fetch(`${baseUrl}${path}`, init);
  const body = (await response.json()) as T;

  return { status: response.status, body };
}

export function actorHeaders(
  secret: string,
  userId: string,
): Record<string, string> {
  return {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
    "X-User-Id": userId,
  };
}
