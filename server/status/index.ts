import prisma from "@/lib/prisma";
import Elysia, { t } from "elysia";

export const statusRoute = new Elysia().get(
  "/notes/:id/status",
  async ({ params, set }) => {
    try {
      const note = await prisma.note.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          createdAt: true,
          expiresAt: true,
          maxViews: true,
          viewCount: true,
          isDestroyed: true,
          isEncrypted: true,
        },
      });

      if (!note || note.isDestroyed) {
        set.status = 404;
        return {
          success: false,
          message: "Note not found",
        };
      }

      const isExpired = note.expiresAt && new Date() > note.expiresAt;
      const maxViewsReached = note.viewCount >= note.maxViews;

      return {
        success: true,
        exists: true,
        isExpired,
        maxViewsReached,
        isEncrypted: note.isEncrypted,
        viewsLeft: Math.max(0, note.maxViews - note.viewCount),
        expiresAt: note.expiresAt,
      };
    } catch (error) {
      set.status = 500;
      return {
        success: false,
        message: "Failed to check note status",
      };
    }
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
);
