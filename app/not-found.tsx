import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-full bg-muted p-4">
          <Ghost className="w-12 h-12 text-primary" />
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" passHref>
          <Button className="mt-4 rounded-full px-6 py-2 text-base font-semibold">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
