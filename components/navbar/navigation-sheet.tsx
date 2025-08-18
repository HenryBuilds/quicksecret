import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";
import Image from "next/image";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
          <Image alt="Logo" src={"/logo.svg"} width={50} height={50}/>
        <NavMenu orientation="vertical" className="mt-12" />
      </SheetContent>
    </Sheet>
  );
};
