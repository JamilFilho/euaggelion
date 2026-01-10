import Link from "next/link";
import { ElementType } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { navigationLinks } from "@/lib/navigation";

interface SiteHeaderNavigationProps {
    icon: ElementType
}

export function SiteHeaderNavigation({icon: Icon}: SiteHeaderNavigationProps) {
    return(
        <div className="flex md:hidden">
            <Drawer>
                <DrawerTrigger>
                    <Icon className="color-white size-5" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Links</DrawerTitle>
                        <DrawerDescription>Navegue pelos nossos conteúdos</DrawerDescription>
                    </DrawerHeader>
                    
                    <DrawerFooter>
                        <div className="grid grid-cols-1 gap-y-8">
                            {Object.values(navigationLinks).map((section, index) => (
                                <ul key={index} className="col-span-1 flex flex-col gap-2">
                                    <li className="text-lg font-bold mb-4">{section.title}</li>
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            <DrawerClose asChild>
                                            <Link href={item.href} title={item.label} className="text-accent underline decoration-dashed font-bold">
                                                {item.label}
                                            </Link>
                                            </DrawerClose>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}