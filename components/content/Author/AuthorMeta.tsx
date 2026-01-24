interface AuthorMetaProps {
    name: string;
    bio: string;
}

export default function AuthorMeta({name, bio}: AuthorMetaProps) {
    return(
        <div className="px-10 md:px-0 md:pr-10 col-span-1 md:col-span-4 text-center md:text-left">
            <h3 className="text-2xl font-semibold">{name}</h3>
            <p className="text-foreground/70 mt-2">{bio}</p>
        </div>
    )
}