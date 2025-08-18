import { App } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "localhost:3000";

export const rpc = treaty<App>(API_URL);
