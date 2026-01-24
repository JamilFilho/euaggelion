import { Popover } from "@/components/ui/popover";
import { ReactNode } from "react";

interface DictionaryRootProps {
    children: ReactNode;
}

export default function DictionaryRoot({children}: DictionaryRootProps) {
    return(
        <Popover>
            {children}
        </Popover>
    )
}