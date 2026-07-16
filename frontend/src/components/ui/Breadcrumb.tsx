"use client";

import React from "react";
import Link from "next/link";
import { CaretRight, House } from "@phosphor-icons/react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-muted-foreground select-none ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5">
        <li className="flex items-center">
          <Link href="/" className="hover:text-foreground flex items-center transition-colors">
            <House size={14} className="mr-1" />
            <span>Trang chủ</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <CaretRight size={12} className="text-muted-foreground/50 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-bold text-foreground truncate max-w-[20ch] sm:max-w-[none]">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors truncate max-w-[20ch]">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
