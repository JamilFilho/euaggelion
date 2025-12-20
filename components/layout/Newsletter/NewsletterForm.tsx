import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
    return(
        <form className="flex flex-col md:flex-row">
            <input className="w-full bg-transparent py-4 px-10 focus:outline-none border-t border-b border-ring/20" placeholder="Seu e-mail" required type="email" />
            <button type="submit" className="flex flex-row justify-between items-center px-10 py-4 md:border-l md:border-t border-b border-ring/20 md:w-1/3 bg-black/20 hover:bg-black/30 text-foreground transition-all ease-in-out hover:pr-8 font-semibold dark:font-normal">
                <span>Assinar a Newsletter</span>
                <ArrowRight className="size-4"/>
            </button>
        </form>
    )
}