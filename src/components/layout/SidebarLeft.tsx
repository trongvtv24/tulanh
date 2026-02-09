"use client";

import { Button } from "@/components/ui/button";
import { MAIN_NAV_ITEMS } from "@/config/menu.config";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

export function SidebarLeft() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Helper to get translated label safely
  const getLabel = (item: typeof MAIN_NAV_ITEMS[0]) => {
    if (item.label) return item.label;
    const keys = item.labelKey.split('.');
    // simple safe access for t.nav.community etc
    // @ts-expect-error - t is typed as Record<string, any> in some contexts
    return t[keys[0]]?.[keys[1]] || item.labelKey;
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="space-y-1">
        {MAIN_NAV_ITEMS.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={`w-full justify-start font-medium transition-all duration-200 ${isActive(item.href)
              ? "bg-primary/20 text-primary-foreground border-l-4 border-primary rounded-r-full"
              : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            asChild
          >
            <Link href={item.href}>
              <item.icon
                className={`mr-2 h-4 w-4 ${isActive(item.href) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
              />
              {getLabel(item)}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
