import Elysia, { t } from "elysia";
import { createNote } from "@/services/noteService";

export const writeRoute = new Elysia().post('/notes', async ({ body, set }) => {
  try {
    const noteData = await createNote(body);
    set.status = 201;
    return {
      success: true,
      id: noteData.id,
      message: 'Note created successfully'
    };
  } catch (error) {
    set.status = 500;
    return {
      success: false,
      message: 'Failed to create note',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}, {
  body: t.Object({
    content: t.String({ minLength: 1, maxLength: 10000 }),
    password: t.Optional(t.String({ minLength: 1 })),
    expiresIn: t.Optional(t.Number({ minimum: 1, maximum: 7 * 24 * 60 * 60 * 1000 })), // Max 7 days
    maxViews: t.Optional(t.Number({ minimum: 1, maximum: 100 }))
  })
});