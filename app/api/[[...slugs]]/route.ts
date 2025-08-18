import { Elysia, t } from "elysia";

const app = new Elysia({ prefix: "/api" }).get("/", () => "hello Next");

export type App = typeof app

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
export const HEAD = app.handle;
