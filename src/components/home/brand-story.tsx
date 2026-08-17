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
        <div className="absolute inset-0 bg-zinc-950/80 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-sm font-semibold tracking-widest uppercase mb-4 text-brand">
            Our Story
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-white">
            Crafting modern essentials with timeless appeal.
          </h2>
          <p className="text-zinc-300 text-base md:text-lg mb-6 leading-relaxed max-w-2xl">
            Founded in San Francisco, we set out to create clothing that bridges the gap between everyday comfort and elevated style. Every piece is designed with intention, using sustainable materials and ethical manufacturing processes to ensure that you feel as good as you look.
          </p>
          <p className="text-zinc-300 text-base md:text-lg mb-10 leading-relaxed max-w-xl font-medium">
            We believe that less is more, and quality should never be compromised.
          </p>
          
          <Link 
            href="/about" 
            className="inline-flex items-center justify-center border border-white text-white hover:bg-brand hover:border-brand hover:text-white px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg"
          >
            Read Our Full Story
          </Link>
        </div>
      </div>
    </section>
  );
}
