import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <div className="max-w-xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          About QuickSecret
        </h1>
        <p className="text-lg text-muted-foreground">
          In today&apos;s world, providing anonymous and secure information transfer
          is more important than ever. QuickSecret is my personal contribution to
          this topic, which I find deeply fascinating.
          <br />
          <br />
          This project is{" "}
          <span className="font-semibold text-primary">open source</span> and
          available on GitHub. Everyone is welcome to use it for free, contribute,
          or simply get inspired.
        </p>
        <Link
          href="https://github.com/HenryBuilds/quicksecret"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="rounded-full px-6 py-2 text-base font-semibold flex items-center gap-2"
            variant="outline"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </Button>
        </Link>
      </div>
    </div>
  );
}