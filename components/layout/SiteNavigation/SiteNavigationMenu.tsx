import { ThumbnailGradient } from "@/components/content/thumbnail";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import { ChartBarStacked, Swords, type LucideIcon } from "lucide-react";
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
            icon?: LucideIcon;
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
        title: "Literatura Cristã",
        alt:"Explore nossa biblioteca de literatura cristã",
        href: "#",
        submenu: [
            {
                title: "Cavaleiros da Aurora",
                href: "/s/cavaleiros-da-aurora",
                description: "Embarque nesta saga de fantasia cristã",
                isFeatured: true,
                color: "bg-zinc-700",
                icon: Swords
            },
            {
                title: "Ficção Cristã",
                href: "/s/ficcao-crista",
                description: "A fé cristã e seus valores expressos em narrativas e histórias ficcionais"
            },
            {
                title: "Ensaios de um Peregrino",
                href: "/s/ensaios-de-um-peregrino",
                description: "Esaios diários de um peregrino refletindo sobre a vida enquanto caminha pelos desertos da existência"
            }
        ]
    },
    {
        title: "Trilhas de Conteúdo",
        alt:"Siga nossas trilhas de estudo e conteúdo",
        href: "/trilhas"
    },
    {
        title: "Wiki",
        alt:"Acesse nosso repositório de referência",
        href: "/wiki",
        submenu: [
            {
                title: "Cronologia bíblica",
                href: "/wiki/cronologia",
                description: "Estude os eventos bíblicos em ordem cronológica",
                isFeatured: true,
                color: "bg-zinc-800",
                icon: ChartBarStacked
            },
            {
                title: "Credos cristãos",
                href: "/wiki/credos",
                description: "Declarações e documentos de fé"
            },
            {
                title: "Glossário Teológico",
                href: "/wiki/glossario",
                description: "Termos e definições teológicas para aprofundar seu conhecimento"
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
        <div className="hidden md:flex z-[830]">
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
                                                        {sublink.icon ? (
                                                            <sublink.icon className="h-5 w-5 text-foreground/80 mb-3" aria-hidden />
                                                        ) : null}
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