"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getRankByLevel, type RankConfig } from "@/config/ranks";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface RankBadgeProps {
    level: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    showTooltip?: boolean;
    showName?: boolean;
    showGlow?: boolean;
    showAnimation?: boolean;
    className?: string;
}

const sizeConfig = {
    xs: { width: 24, height: 24, className: "w-6 h-6", imgSuffix: "-sm" },
    sm: { width: 32, height: 32, className: "w-8 h-8", imgSuffix: "-sm" },
    md: { width: 48, height: 48, className: "w-12 h-12", imgSuffix: "" },
    lg: { width: 64, height: 64, className: "w-16 h-16", imgSuffix: "" },
    xl: { width: 96, height: 96, className: "w-24 h-24", imgSuffix: "-lg" },
};

// Animation cho từng level
const levelAnimations = {
    1: "", // Không animation
    2: "", // Không animation
    3: "animate-glow-emerald", // Glow xanh ngọc
    4: "animate-glow-blue animate-pulse-slow", // Glow xanh + pulse
    5: "animate-glow-fire animate-sparkle", // Glow lửa + sparkle
};

export function RankBadge({
    level,
    size = "md",
    showTooltip = true,
    showName = false,
    showGlow = true,
    showAnimation = true,
    className,
}: RankBadgeProps) {
    const rank = getRankByLevel(level);
    const { width, height, className: sizeClassName, imgSuffix } = sizeConfig[size];

    // Tạo đường dẫn ảnh với suffix size
    const imagePath = rank.image.replace('.png', `${imgSuffix}.png`);

    const badgeContent = (
        <div
            className={cn(
                "relative flex flex-col items-center gap-1",
                className
            )}
        >
            {/* Outer glow ring cho rank cao */}
            {showGlow && level >= 3 && showAnimation && (
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        level === 3 && "animate-ring-pulse-emerald",
                        level === 4 && "animate-ring-pulse-blue",
                        level === 5 && "animate-ring-pulse-fire"
                    )}
                />
            )}

            <div
                className={cn(
                    "relative rounded-full overflow-visible transition-all duration-300",
                    sizeClassName,
                    showGlow && [
                        "shadow-lg hover:shadow-xl",
                        rank.glowColor,
                    ],
                    // Animation classes
                    showAnimation && levelAnimations[level as keyof typeof levelAnimations]
                )}
            >
                {/* Sparkle particles cho level 5 */}
                {level === 5 && showAnimation && (
                    <>
                        <span className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-sparkle-1" />
                        <span className="absolute -top-2 right-1 w-1.5 h-1.5 bg-orange-400 rounded-full animate-sparkle-2" />
                        <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-sparkle-3" />
                        <span className="absolute bottom-0 -left-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-sparkle-4" />
                    </>
                )}

                {/* Lightning effect cho level 4 */}
                {level === 4 && showAnimation && (
                    <div className="absolute inset-0 rounded-full animate-lightning-flash opacity-0" />
                )}

                <Image
                    src={imagePath}
                    alt={rank.name}
                    width={width * 2}
                    height={height * 2}
                    quality={100}
                    priority={size === "lg" || size === "xl"}
                    className={cn(
                        "object-contain w-full h-full transform hover:scale-110 transition-transform duration-300",
                        level >= 4 && showAnimation && "hover:rotate-3"
                    )}
                />
            </div>
            {showName && (
                <span
                    className={cn(
                        "text-xs font-medium whitespace-nowrap",
                        rank.color,
                        level >= 4 && showAnimation && "animate-text-shimmer"
                    )}
                >
                    {rank.nameVi}
                </span>
            )}
        </div>
    );

    if (!showTooltip) {
        return badgeContent;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="bg-background/95 backdrop-blur-sm border border-border"
                >
                    <div className="flex items-center gap-3 p-1">
                        <Image
                            src={rank.image}
                            alt={rank.name}
                            width={40}
                            height={40}
                            quality={100}
                            className="object-contain"
                        />
                        <div>
                            <p className={cn("font-semibold", rank.color)}>
                                Level {rank.level}: {rank.nameVi}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {rank.description}
                            </p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

/**
 * Component hiển thị rank badge inline với text
 */
export function RankBadgeInline({
    level,
    className,
}: {
    level: number;
    className?: string;
}) {
    return (
        <RankBadge
            level={level}
            size="xs"
            showGlow={false}
            showAnimation={false}
            className={className}
        />
    );
}

/**
 * Component hiển thị rank badge lớn với tên và XP bar
 */
export function RankBadgeCard({
    level,
    xp,
    xpToNext,
    className,
}: {
    level: number;
    xp: number;
    xpToNext: number;
    className?: string;
}) {
    const rank = getRankByLevel(level);
    const progress = xpToNext > 0 ? ((xp % 100) / xpToNext) * 100 : 100;

    return (
        <div
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-background to-secondary/20 border border-border",
                className
            )}
        >
            <RankBadge level={level} size="lg" showTooltip={false} />
            <div className="flex-1">
                <p className={cn("font-bold text-lg", rank.color)}>
                    {rank.nameVi}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                    Level {level} • {xp} XP
                </p>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            level === 5
                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                : "bg-gradient-to-r from-primary to-primary/60"
                        )}
                        style={{ width: `${level === 5 ? 100 : progress}%` }}
                    />
                </div>
                {level < 5 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {xpToNext} XP đến level tiếp theo
                    </p>
                )}
                {level === 5 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        🏆 Đã đạt cấp cao nhất!
                    </p>
                )}
            </div>
        </div>
    );
}
