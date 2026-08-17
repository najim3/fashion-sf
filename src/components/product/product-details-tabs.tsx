"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailsTabsProps {
  descriptionHtml?: string;
}

export function ProductDetailsTabs({ descriptionHtml }: ProductDetailsTabsProps) {
  const [openTab, setOpenTab] = useState<string>("description");

  const toggleTab = (tab: string) => {
    setOpenTab(openTab === tab ? "" : tab);
  };

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: descriptionHtml ? (
        <div 
          className="prose prose-sm max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }} 
        />
      ) : (
        <p className="text-muted-foreground text-sm">No description available for this product.</p>
      )
    },
    {
      id: "specifications",
      label: "Specifications",
      content: (
        <div className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Material:</strong> 100% Premium Quality</li>
            <li><strong>Care:</strong> Machine wash cold, tumble dry low</li>
            <li><strong>Fit:</strong> Regular fit, true to size</li>
            <li><strong>Origin:</strong> Imported</li>
          </ul>
        </div>
      )
    },
    {
      id: "size-guide",
      label: "Size Guide",
      content: (
        <div className="text-sm text-muted-foreground">
          <p className="mb-4">Our sizes generally run true to size. Please refer to the chart below:</p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 font-medium">Size</th>
                <th className="py-2 font-medium">Chest (in)</th>
                <th className="py-2 font-medium">Waist (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2">S</td>
                <td className="py-2">34-36</td>
                <td className="py-2">28-30</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2">M</td>
                <td className="py-2">38-40</td>
                <td className="py-2">32-34</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2">L</td>
                <td className="py-2">42-44</td>
                <td className="py-2">36-38</td>
              </tr>
              <tr>
                <td className="py-2">XL</td>
                <td className="py-2">46-48</td>
                <td className="py-2">40-42</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content: (
        <div className="text-sm text-muted-foreground space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-1">Standard Shipping</h4>
            <p>Delivery in 3-5 business days. Free on orders over $150.</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Express Shipping</h4>
            <p>Delivery in 1-2 business days. Flat rate of $15.</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Returns</h4>
            <p>We accept returns within 30 days of purchase for unworn, unwashed items in their original condition.</p>
          </div>
        </div>
      )
    },
    {
      id: "reviews",
      label: "Reviews & Ratings",
      content: (
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-display font-bold text-foreground">4.8</div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Based on 124 reviews</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Sarah M.</h4>
                  <div className="text-yellow-400 text-xs">★★★★★</div>
                </div>
                <span className="text-muted-foreground text-xs">2 days ago</span>
              </div>
              <p>Absolutely love this! The quality is amazing and it fits perfectly. Will definitely be ordering more colors.</p>
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Michael T.</h4>
                  <div className="text-yellow-400 text-xs">★★★★☆</div>
                </div>
                <span className="text-muted-foreground text-xs">1 week ago</span>
              </div>
              <p>Great product overall. The material feels very premium. Shipping took a bit longer than expected, but worth the wait.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="border-t border-border mt-8">
      {tabs.map((tab) => (
        <div key={tab.id} className="border-b border-border">
          <button
            onClick={() => toggleTab(tab.id)}
            className="flex w-full items-center justify-between py-4 text-left font-medium text-foreground focus:outline-none"
          >
            {tab.label}
            <ChevronDown 
              className={cn(
                "w-5 h-5 transition-transform duration-300", 
                openTab === tab.id ? "rotate-180" : ""
              )} 
            />
          </button>
          
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              openTab === tab.id ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"
            )}
          >
            {tab.content}
          </div>
        </div>
      ))}
    </div>
  );
}
