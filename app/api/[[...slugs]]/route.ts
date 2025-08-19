import { Elysia, t } from "elysia";
import { writeRoute } from "@/server/write";
import { readRoute } from "@/server/read";
import { cors } from "@elysiajs/cors";
import { deleteExpiredNotes } from "@/services/noteService";
import { deleteRoute } from "@/server/delete";
import { statusRoute } from "@/server/status";

const app = new Elysia({ prefix: "/api" })
  .onStart(async () => {
    console.log("🚀 Server started");

    setInterval(async () => {
      await deleteExpiredNotes();
    }, 5 * 60 * 1000);
  })
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "DELETE"],
      credentials: true,
    })
  )
  .use(writeRoute)
  .use(readRoute)
  .use(deleteRoute)
  .use(statusRoute)
  .get("/", () => "hello Next");

app.get("/health", () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
export const HEAD = app.handle;
