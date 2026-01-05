import { ThumbnailGradient } from "@/components/content/thumbnail";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import Link from "next/link"

interface WikiLink {
  title: string;
  href: string;
  alt: string;
  submenu?: {
    title: string;
    href: string;
    description?: string;
    isFeatured?: boolean;
    color?: string;
  }[];
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

export default function WikiNavigationMenu() {
    return(
        <div className="ml-auto hidden md:flex">
            <NavigationMenu>
                <NavigationMenuList>
                    {wikiLinks.map((link) => (
                        <NavigationMenuItem key={link.href}>
                            {link.submenu ? (
                                <>
                                <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                <ul className="py-6 grid gap-2 md:w-[40rem] grid-cols-[.75fr_1fr]">
                                    {link.submenu.map((sublink, index) => (
                                        sublink.isFeatured ? (
                                            <li key={sublink.href} className="px-6 row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className={`h-full flex flex-col justify-end rounded-md no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6 ${sublink.color ? sublink.color : "bg-accent"} `}
                                                        href={sublink.href}
                                                    >
                                                        <div className="mb-2 text-lg text-foreground font-medium">
                                                            {sublink.title}
                                                        </div>
                                                        <p className="text-foreground/60 text-sm leading-tight">
                                                            {sublink.description}
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                        ) : (
                                            <ul key={sublink.href} className="pr-4">
                                                <ListItem href={sublink.href} title={sublink.title}>
                                                    {sublink.description}
                                                </ListItem>
                                            </ul>
                                        )
                                    ))}
                                </ul>
                                </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={link.href}
                                        className="mx-4 font-semibold hover:text-accent transition-all ease-in-out"
                                        title={link.alt}
                                    >
                                        {link.title}
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props} className="my-2">
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-base leading-none font-medium">{title}</div>
          <p className="text-foreground/60 line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}