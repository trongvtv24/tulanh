/**
 * Rank Configuration
 * 5 Level Ranking System with Dragon/Koi Theme
 */

export interface RankConfig {
    level: number;
    name: string;
    nameVi: string;
    description: string;
    image: string;
    minXp: number;
    maxXp: number;
    color: string;
    glowColor: string;
}

export const RANKS: RankConfig[] = [
    {
        level: 1,
        name: "Silver Koi",
        nameVi: "Cá Koi Bạc",
        description: "Beginner - Just starting the journey",
        image: "/ranks/rank-1.png",
        minXp: 0,
        maxXp: 99,
        color: "text-gray-400",
        glowColor: "shadow-gray-400/50",
    },
    {
        level: 2,
        name: "Golden Koi",
        nameVi: "Cá Koi Vàng",
        description: "Apprentice - Learning the ropes",
        image: "/ranks/rank-2.png",
        minXp: 100,
        maxXp: 299,
        color: "text-yellow-500",
        glowColor: "shadow-yellow-500/50",
    },
    {
        level: 3,
        name: "Jade Dragon",
        nameVi: "Rồng Xanh Ngọc",
        description: "Skilled - Mastering the craft",
        image: "/ranks/rank-3.png",
        minXp: 300,
        maxXp: 599,
        color: "text-emerald-500",
        glowColor: "shadow-emerald-500/50",
    },
    {
        level: 4,
        name: "Thunder Dragon",
        nameVi: "Rồng Xanh Dương",
        description: "Expert - Commanding respect",
        image: "/ranks/rank-4.png",
        minXp: 600,
        maxXp: 999,
        color: "text-blue-500",
        glowColor: "shadow-blue-500/50",
    },
    {
        level: 5,
        name: "Phoenix Dragon",
        nameVi: "Rồng Đỏ",
        description: "Legend - The ultimate master",
        image: "/ranks/rank-5.png",
        minXp: 1000,
        maxXp: Infinity,
        color: "text-red-500",
        glowColor: "shadow-red-500/50",
    },
];

/**
 * Get rank configuration by level
 */
export function getRankByLevel(level: number): RankConfig {
    const clampedLevel = Math.min(Math.max(level, 1), 5);
    return RANKS[clampedLevel - 1];
}

/**
 * Get rank configuration by XP
 */
export function getRankByXp(xp: number): RankConfig {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].minXp) {
            return RANKS[i];
        }
    }
    return RANKS[0];
}

/**
 * Calculate XP progress percentage within current rank
 */
export function getXpProgressInRank(xp: number): number {
    const rank = getRankByXp(xp);
    if (rank.level === 5) {
        return 100; // Max level
    }
    const xpInRank = xp - rank.minXp;
    const xpForRank = rank.maxXp - rank.minXp + 1;
    return Math.min((xpInRank / xpForRank) * 100, 100);
}

/**
 * Get XP needed to reach next rank
 */
export function getXpToNextRank(xp: number): number {
    const rank = getRankByXp(xp);
    if (rank.level === 5) {
        return 0; // Already max
    }
    return rank.maxXp + 1 - xp;
}
