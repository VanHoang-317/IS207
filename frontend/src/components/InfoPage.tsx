import Link from "next/link"
import { ArrowRight, ChevronRight, Home } from "lucide-react"

type InfoSection = {
    title: string
    content: string
    items?: string[]
}

type InfoPageProps = {
    eyebrow: string
    title: string
    description: string
    heroImage: string
    heroAlt: string
    highlights: string[]
    sections: InfoSection[]
    cta?: {
        label: string
        href: string
    }
}

export function InfoPage({
    eyebrow,
    title,
    description,
    heroImage,
    heroAlt,
    highlights,
    sections,
    cta,
}: InfoPageProps) {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="bg-[var(--soft-gray)] border-b border-[var(--border)]">
                <div className="container mx-auto px-4 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            Home
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <span className="font-medium">{title}</span>
                    </nav>
                </div>
            </div>

            <section className="container mx-auto px-4 lg:px-8 py-10 md:py-14">
                <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
                    <div className="space-y-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--rose-gold-dark)]">{eyebrow}</p>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">{title}</h1>
                        <p className="text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
                            {description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3 pt-2">
                            {highlights.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-sm font-medium shadow-sm"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>

                        {cta ? (
                            <Link
                                href={cta.href}
                                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white gradient-primary hover:opacity-90"
                            >
                                {cta.label}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : null}
                    </div>

                    <div className="relative h-[280px] md:h-[420px] overflow-hidden rounded-[28px] border border-[var(--border)] shadow-sm">
                        <img
                            src={heroImage}
                            alt={heroAlt}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 lg:px-8 pb-14 md:pb-20">
                <div className="grid gap-5 md:grid-cols-2">
                    {sections.map((section) => (
                        <article
                            key={section.title}
                            className="rounded-3xl border border-[var(--border)] bg-white p-6 md:p-7 shadow-sm"
                        >
                            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                            <p className="text-[var(--muted-foreground)] leading-relaxed">{section.content}</p>

                            {section.items?.length ? (
                                <ul className="mt-4 space-y-2">
                                    {section.items.map((item) => (
                                        <li key={item} className="rounded-xl bg-[var(--soft-gray)] px-4 py-3 text-sm text-[var(--foreground)]">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
