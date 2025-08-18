import prisma from "@/lib/prisma";
import React from "react";

const Page = async () => {
  const notes = await prisma.note.findMany();

  return (
    <div>
      <h1>All notes</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.slug}</strong>
            <div>Encryption: {note.encryptionMethod}</div>
            <div>Created: {note.createdAt.toISOString()}</div>
            <div>Destroyed: {note.destroyed ? "Yes" : "No"}</div>
            <div>View Count: {note.viewCount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
