import prisma from "@/lib/prisma";
import { CreateNoteInput, NoteResponse } from "@/types/types";
import {
  createHash,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  pbkdf2Sync,
} from "crypto";

function encryptContent(
  content: string,
  password: string
): { encrypted: string; iv: string; salt: string } {
  const salt = randomBytes(32);
  const key = pbkdf2Sync(password, salt, 100000, 32, "sha512");
  const iv = randomBytes(16);

  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(content, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encrypted,
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
  };
}

export function decryptContent(
  encrypted: string,
  password: string,
  iv: string,
  salt: string
): string {
  const saltBuffer = Buffer.from(salt, "hex");
  const key = pbkdf2Sync(password, saltBuffer, 100000, 32, "sha512");
  const ivBuffer = Buffer.from(iv, "hex");

  const decipher = createDecipheriv("aes-256-cbc", key, ivBuffer);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export async function createNote(input: CreateNoteInput) {
  const { content, password, expiresIn, maxViews = 1 } = input;

  let noteData: {
    content: string;
    iv?: string;
    salt?: string;
    isEncrypted: boolean;
    expiresAt?: Date;
    maxViews: number;
  };

  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn) : null;

  if (password) {
    const { encrypted, iv, salt } = encryptContent(content, password);
    noteData = {
      content: encrypted,
      iv,
      salt,
      isEncrypted: true,
      maxViews,
      ...(expiresAt && { expiresAt }),
    };
  } else {
    noteData = {
      content,
      isEncrypted: false,
      maxViews,
      ...(expiresAt && { expiresAt }),
    };
  }

  const note = await prisma.note.create({
    data: noteData,
  });

  return note;
}

export async function getNoteById(
  id: string,
  password?: string
): Promise<NoteResponse | null> {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note || note.isDestroyed) {
    return null;
  }

  if (note.expiresAt && new Date() > note.expiresAt) {
    await prisma.note.update({
      where: { id },
      data: { isDestroyed: true },
    });
    return null;
  }

  if (note.viewCount >= note.maxViews) {
    return null;
  }

  let content: string;

  if (note.isEncrypted) {
    if (!password) {
      throw new Error("Password is required for encrypted notes");
    }

    if (!note.iv || !note.salt) {
      throw new Error("Corrupted encrypted note");
    }

    try {
      content = decryptContent(note.content, password, note.iv, note.salt);
    } catch {
      throw new Error("Invalid password or corrupted note");
    }
  } else {
    content = note.content;
  }

  const newViewCount = note.viewCount + 1;
  const destroyed = newViewCount >= note.maxViews;

  prisma.note
    .update({
      where: { id },
      data: {
        viewCount: newViewCount,
        ...(destroyed
          ? {
              isDestroyed: true,
              content: "",
              iv: null,
              salt: null,
            }
          : {}),
      },
    })
    .catch(() => {});

  return {
    id: note.id,
    content,
    createdAt: note.createdAt,
    viewCount: newViewCount,
    isEncrypted: note.isEncrypted,
  };
}

export async function deleteExpiredNotes(): Promise<number> {
  const result = await prisma.note.updateMany({
    where: {
      OR: [
        {
          expiresAt: {
            lte: new Date(),
          },
        },
        {
          isDestroyed: true,
          createdAt: {
            lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      ],
    },
    data: {
      isDestroyed: true,
      content: "",
      iv: null,
      salt: null,
    },
  });

  if (result.count > 0) {
    console.log(`🗑️  Cleaned up ${result.count} expired notes`);
  }

  return result.count;
}
