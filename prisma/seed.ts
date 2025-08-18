import { PrismaClient } from "../app/generated/prisma";
const prisma = new PrismaClient();

const notes = [{
        slug: "test-note-1",
        content: "U2FsdGVkX1+encryptedcontent1==", // encrypted note
        encryptionMethod: "aes-256-gcm",
        encryptionMeta: { iv: "randomIV1", salt: "randomSalt1" },
        createdAt: new Date(),
        expiresAt: null,
        viewedAt: null,
        destroyed: false,
        viewLimit: 1,
        viewCount: 0,
        passphrase: null,
        ipCreated: "127.0.0.1",
        userAgent: "seed-script",
        deletedAt: null,
    },
    {
        slug: "test-note-2",
        content: "U2FsdGVkX1+encryptedcontent2==",
        encryptionMethod: "rsa",
        encryptionMeta: { publicKeyId: "key-123" },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        viewedAt: null,
        destroyed: false,
        viewLimit: 5,
        viewCount: 0,
        passphrase: "hashed-passphrase",
        ipCreated: "192.168.1.1",
        userAgent: "seed-script",
        deletedAt: null,
    },
];

export async function main() {
    for (const n of notes) {
        await prisma.note.create({ data: n });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });