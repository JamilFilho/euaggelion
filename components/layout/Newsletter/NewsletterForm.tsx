export function NewsletterForm() {
    return(
        <form className="flex flex-col md:flex-row">
            <input className="w-full bg-transparent py-4 px-10 focus:outline-none border-t border-b border-ring/20" placeholder="Seu e-mail" required type="email" />
            <button type="submit" className="p-4 md:border-t md:border-b md:border-ring/20 md:w-1/3 bg-background/10 hover:bg-background/20 transition-all ease-in-out">Assinar</button>
        </form>
    )
}