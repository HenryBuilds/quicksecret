import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-muted">
<nav className="fixed top-6 inset-x-4 h-16 bg-white dark:bg-neutral-900 border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Image alt="Logo" src={"/logo.svg"} width={50} height={50} />
            <span className="font-bold text-lg">QuickSecret</span>
          </Link>
          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <Link href="/" passHref>
              <Button className="rounded-full" asChild>
                <span>Create Note</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
