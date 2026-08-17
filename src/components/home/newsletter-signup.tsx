"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle2 } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function NewsletterSignup() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    // Simulate API call to email provider (e.g., Klaviyo, Mailchimp)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Newsletter signup:", data.email);
    setIsSuccess(true);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Join Our Newsletter
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
          Subscribe to receive updates, access to exclusive deals, and more. 
          We respect your privacy and will never share your information.
        </p>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-3 animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
            <h3 className="text-xl font-medium">Thank you for subscribing!</h3>
            <p className="text-muted-foreground">You're now on the list.</p>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="flex-grow text-left">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-5 py-4 bg-background/10 border border-gray-700 rounded-full focus:outline-none focus:border-white focus:bg-background/20 transition-colors text-white placeholder:text-muted-foreground"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-2 text-red-400 text-sm px-4">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-background text-foreground hover:bg-muted px-8 py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap h-[58px]"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Subscribe <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
