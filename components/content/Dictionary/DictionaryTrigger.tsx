import { PopoverTrigger } from "@radix-ui/react-popover";
import { Info } from "lucide-react";

interface DictionaryTriggerProps {
    content: string;
}

export default function DictionaryTrigger({content}: DictionaryTriggerProps) {
    return(
        <PopoverTrigger>
            <span className="cursor-pointer text-accent border-b border-accent flex flex-row items-center px-1 gap-2">
                {content}
                <Info className="size-4" />
            </span>
        </PopoverTrigger>
    )
}