import { BADGES, Badge, UserBadge } from '../types/badges';

export interface UserStats {
  ecoPoints: number;
  totalRecycled: number;
  neighborhood?: string;
  neighborhoodRank?: number;
  singaporeRank?: number;
}

export class BadgeService {
  /**
   * Calculate which badges a user has earned based on their stats
   */
  static calculateEarnedBadges(userStats: UserStats): UserBadge[] {
    const earnedBadges: UserBadge[] = [];

    BADGES.forEach(badge => {
      const progress = this.calculateBadgeProgress(badge, userStats);
      
      if (progress >= 100) {
        earnedBadges.push({
          badgeId: badge.id,
          earnedAt: new Date(), // In a real app, this would be stored in the database
          progress: 100,
        });
      }
    });

    return earnedBadges;
  }

  /**
   * Calculate progress towards a specific badge
   */
  static calculateBadgeProgress(badge: Badge, userStats: UserStats): number {
    const { requirement } = badge;
    
    switch (requirement.type) {
      case 'eco_points':
        return Math.min(100, (userStats.ecoPoints / requirement.value) * 100);
      
      case 'items_recycled':
        return Math.min(100, (userStats.totalRecycled / requirement.value) * 100);
      
      case 'neighborhood_rank':
        if (!userStats.neighborhoodRank) return 0;
        return userStats.neighborhoodRank <= requirement.value ? 100 : 0;
      
      case 'singapore_rank':
        if (!userStats.singaporeRank) return 0;
        return userStats.singaporeRank <= requirement.value ? 100 : 0;
      
      case 'streak':
        // For now, return 0 as we don't have streak data
        return 0;
      
      default:
        return 0;
    }
  }

  /**
   * Get all badges with progress for a user
   */
  static getAllBadgesWithProgress(userStats: UserStats): (Badge & { progress: number; earned: boolean })[] {
    return BADGES.map(badge => {
      const progress = this.calculateBadgeProgress(badge, userStats);
      return {
        ...badge,
        progress,
        earned: progress >= 100,
      };
    });
  }

  /**
   * Get badge by ID
   */
  static getBadgeById(badgeId: string): Badge | undefined {
    return BADGES.find(badge => badge.id === badgeId);
  }

  /**
   * Get badges by rarity
   */
  static getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
    return BADGES.filter(badge => badge.rarity === rarity);
  }
}
