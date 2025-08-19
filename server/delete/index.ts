import prisma from "@/lib/prisma";
import { decryptContent } from "@/services/noteService";
import Elysia, { t } from "elysia";

export const deleteRoute = new Elysia().delete('/notes/:id', async ({ params, query, set }) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id }
    });

    if (!note || note.isDestroyed) {
      set.status = 404;
      return {
        success: false,
        message: 'Note not found'
      };
    }

    // If note is encrypted and password provided, validate it
    if (note.isEncrypted && query?.password && note.iv && note.salt) {
      try {
        // Try to decrypt to validate password
        decryptContent(note.content, query.password, note.iv, note.salt);
      } catch (error) {
        set.status = 401;
        return {
          success: false,
          message: 'Invalid password'
        };
      }
    }

    await prisma.note.update({
      where: { id: params.id },
      data: { isDestroyed: true }
    });

    return {
      success: true,
      message: 'Note deleted successfully'
    };
  } catch (error) {
    set.status = 500;
    return {
      success: false,
      message: 'Failed to delete note'
    };
  }
}, {
  params: t.Object({
    id: t.String()
  }),
  query: t.Optional(t.Object({
    password: t.Optional(t.String())
  }))
});