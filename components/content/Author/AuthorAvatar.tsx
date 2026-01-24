import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/lib/utils";

interface AuthorAvatarProps {
    content: string;
}

export default function AuthorAvatar({content}: AuthorAvatarProps) {
    return(
        <div className="px-10 md:px-0 flex items-center justify-center col-span-1">
            <Avatar className="w-20 h-20">
                <AvatarImage src={`/images/avatars/${slugify(content)}/photo.jpeg`} />
                <AvatarFallback>
                    <Skeleton className="h-20 w-20 rounded-full" />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}