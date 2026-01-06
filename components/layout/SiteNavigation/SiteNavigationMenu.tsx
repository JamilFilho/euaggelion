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

interface SiteLink {
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

const siteLinks: SiteLink[] = [
    {
        title:"Início",
        alt:"Página Inicial",
        href:"/"
    },
    {
        title: "Bíblia Online",
        alt:"Leia a Bíblia Sagrada online",
        href: "/biblia"
    },
    {
        title: "Devocionais",
        alt:"Medite em nossos devocionais diários",
        href: "/s/cada-manha"
    },
    {
        title: "Download",
        alt:"Baixe nossos materiais gratuitos",
        href: "#",
        submenu: [
            {
                title: "eBooks",
                href: "/s/ebook",
                description: "Estudos, devocionais e outros materiais gratuitos para download.",
                isFeatured: true,
                color: "bg-accent"
            },
            {
                title: "Planner de Leitura Bíblica",
                href: "/planners",
                description: "Organize sua leitura devocional com nosso planner de leitura gratuito"
            }
        ]
    },
    {
        title: "TEOleigo",
        alt:"Reflita sobre questões teológicas",
        href: "/s/teoleigo"
    },
    {
        title: "Wiki",
        alt:"Acesse nosso repositório de referência",
        href: "/wiki",
        submenu: [
            {
                title: "Glossário Teológico",
                href: "/wiki/glossario",
                description: "Glossário de referência de termos e conceitos teológicos",
                isFeatured: true,
                color: "bg-zinc-800"
            },
            {
                title: "Credos cristãos",
                href: "/wiki/credos",
                description: "Declarações e documentos de fé"
            },
            {
                title: "Escatologia",
                href: "/wiki/escatologia",
                description: "Escolas escatológicas e interpretações proféticas"
            },
            {
                title: "Teólogos",
                href: "/wiki/teologos",
                description: "Homens e mulheres que marcaram a história da teologia cristã"
            }
            
        ]
    }
];

export function SiteNavigationMenu() {
    return(
        <div className="hidden md:flex z-[810]">
            <NavigationMenu>
                <NavigationMenuList>
                    {siteLinks.map((link) => (
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