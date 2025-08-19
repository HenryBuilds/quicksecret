import Elysia, { t } from "elysia";
import prisma from "@/lib/prisma";
import { getNoteById } from "@/services/noteService";

export const readRoute = new Elysia().get(
  "/notes/:id",
  async ({ params, query, set }) => {
    try {
      const noteCheck = await prisma.note.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          isDestroyed: true,
          isEncrypted: true,
          expiresAt: true,
          maxViews: true,
          viewCount: true,
        },
      });

      if (!noteCheck || noteCheck.isDestroyed) {
        set.status = 404;
        return {
          success: false,
          message: "Note not found or already destroyed",
        };
      }

      if (noteCheck.expiresAt && new Date() > noteCheck.expiresAt) {
        set.status = 404;
        return {
          success: false,
          message: "Note has expired",
        };
      }

      if (noteCheck.viewCount >= noteCheck.maxViews) {
        set.status = 404;
        return {
          success: false,
          message: "Note has reached maximum views",
        };
      }

      if (noteCheck.isEncrypted && !query?.password) {
        set.status = 401;
        return {
          success: false,
          message: "Password required for encrypted note",
          requiresPassword: true,
        };
      }

      const note = await getNoteById(params.id, query?.password);

      if (!note) {
        set.status = 404;
        return {
          success: false,
          message: "Note not found or already destroyed",
        };
      }

      return {
        success: true,
        content: note.content,
        createdAt: note.createdAt,
        viewCount: note.viewCount,
        isEncrypted: note.isEncrypted,
      };
    } catch (error) {
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve note",
      };
    }
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    query: t.Optional(
      t.Object({
        password: t.Optional(t.String()),
      })
    ),
  }
);
