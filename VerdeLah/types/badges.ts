export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: {
    type: 'eco_points' | 'items_recycled' | 'neighborhood_rank' | 'singapore_rank' | 'streak';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  badgeId: string;
  earnedAt: Date;
  progress: number; // 0-100 percentage
}

export const BADGES: Badge[] = [
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: 'Earned 100 eco points',
    icon: '🌱',
    color: '#2E7D32',
    requirement: {
      type: 'eco_points',
      value: 100,
    },
    rarity: 'common',
  },
  {
    id: 'eco_guardian',
    name: 'Eco Guardian',
    description: 'Earned 500 eco points',
    icon: '🛡️',
    color: '#4CAF50',
    requirement: {
      type: 'eco_points',
      value: 500,
    },
    rarity: 'rare',
  },
  {
    id: 'eco_hero',
    name: 'Eco Hero',
    description: 'Finish Top 3 in monthly neighborhood contest',
    icon: '🏘️',
    color: '#9C27B0',
    requirement: {
      type: 'neighborhood_rank',
      value: 3,
    },
    rarity: 'epic',
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    description: 'Finish as Champion in Singapore contest',
    icon: '🏆',
    color: '#FFD700',
    requirement: {
      type: 'singapore_rank',
      value: 1,
    },
    rarity: 'legendary',
  },
];
