import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-3xl md:text-4xl font-display font-bold mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl md:text-3xl font-display font-bold mt-10 mb-4" {...props} />,
    h3: (props) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3" {...props} />,
    p: (props) => <p className="text-muted-foreground leading-relaxed mb-6" {...props} />,
    ul: (props) => <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside text-muted-foreground mb-6 space-y-2" {...props} />,
    li: (props) => <li className="ml-4" {...props} />,
    a: (props) => <a className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-foreground pl-4 italic my-6 text-muted-foreground" {...props} />,
    ...components,
  };
}
