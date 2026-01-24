import { PopoverContent } from "@/components/ui/popover";
import BibliaLink from "../Bible/BibliaLink";

interface DictionaryContentProps {
    content: string;
    title: string;
}

export default function DictionaryContent({content, title}:DictionaryContentProps) {
    return (
        <PopoverContent className="max-h-96 flex flex-col">
            <p className="border-b border-ring/20 pb-4 mb-4">
                <span className="font-bold">verbete</span> — {title}</p>
            <div className="flex-1 overflow-y-auto px-1">
                <BibliaLink>
                    {content}
                </BibliaLink>
            </div>
        </PopoverContent>
    )
}