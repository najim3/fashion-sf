import Image from "next/image";
import Link from "next/link";

export function BrandStory() {
  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1780&auto=format&fit=crop"
          alt="Fashion Studio"
          fill
          className="object-cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-4 text-zinc-400">Our Story</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
            Crafting modern essentials with timeless appeal.
          </h3>
          <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
            Founded in San Francisco, we set out to create clothing that bridges the gap between everyday comfort and elevated style. Every piece is designed with intention, using sustainable materials and ethical manufacturing processes to ensure that you feel as good as you look.
          </p>
          <p className="text-zinc-300 text-lg mb-10 leading-relaxed">
            We believe that less is more, and quality should never be compromised.
          </p>
          
          <Link 
            href="/about" 
            className="inline-block border border-white text-white hover:bg-background hover:text-foreground px-8 py-3 rounded-full font-medium transition-colors"
          >
            Read Our Full Story
          </Link>
        </div>
      </div>
    </section>
  );
}
