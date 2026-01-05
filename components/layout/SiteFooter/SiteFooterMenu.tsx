import Link from "next/link";
import { navigationLinks } from "@/lib/navigation";

export function SiteFooterMenu() {
    const menuSections = [
        navigationLinks.devocionais,
        navigationLinks.download,
        navigationLinks.estudoBiblico,
        navigationLinks.ferramentasEstudo,
        navigationLinks.opiniao,
        navigationLinks.wiki,
        navigationLinks.institucional,
    ];

    return(
      <div className="px-10 col-span-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {menuSections.map((section, index) => (
            <ul key={index} className="col-span-1 flex flex-col gap-2">
                <li className="text-lg font-bold mb-4">{section.title}</li>
                {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                        <Link href={item.href} title={item.label} className="text-accent underline decoration-dotted underline-offset-4">
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        ))}
      </div>
    )
}