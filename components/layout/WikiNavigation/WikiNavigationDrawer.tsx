"use client"

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface WikiLink {
  title: string;
  href: string;
  alt: string;
}

const wikiLinks: WikiLink[] = [
    {
        title:"Bíblia Sagrada",
        alt:"Bíblia Sagrada",
        href:"/wiki/biblia"
    },
    {
        title:"Credos Cristãos",
        alt:"Credos Cristãos",
        href:"/wiki/credos"
    },
    {
        title:"Glossário Teológico",
        alt:"Glossário Teológico",
        href:"/wiki/glossario"
    },
    {
        title:"História do Cristianismo",
        alt:"História do Cristianismo",
        href:"/wiki/historia-cristianismo"
    },
    {
        title:"Patrística",
        alt:"Patrística",
        href:"/wiki/patristica"
    },
    {
        title:"Teólogos",
        alt:"Teólogos",
        href:"/wiki/teologos"
    }
];

export default function WikiNavigationDrawer() {
    return(
        <div className="ml-auto w-fit flex md:hidden">
            <Drawer>
                <DrawerTrigger asChild>
                    <button title="Abrir menu de navegação">
                        <Menu className="size-5" />
                    </button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>WikiGelion</DrawerTitle>
                        <DrawerDescription>Navegue pelos materiais teológicos e bíblicos</DrawerDescription>
                    </DrawerHeader>
                    
                    <div className="px-4 py-8">
                        <ul className="flex flex-col gap-4">
                            {wikiLinks.map((link) => (
                                <li key={link.href}>
                                    <DrawerClose asChild>
                                        <Link 
                                            href={link.href} 
                                            title={link.alt} 
                                            className="text-accent underline decoration-dotted underline-offset-4"
                                        >
                                            {link.title}
                                        </Link>
                                    </DrawerClose>
                                </li>
                            ))}
                        </ul>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
