import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export interface NeighborhoodStats {
  name: string;
  totalPoints: number;
  totalRecycled: number;
  userCount: number;
  averagePoints: number;
  averageRecycled: number;
}

export interface NeighborhoodUser {
  id: string;
  name: string;
  ecoPoints: number;
  totalRecycled: number;
  neighborhood: string;
}

export class NeighborhoodLeaderboardService {
  /**
   * Get all neighborhoods with their aggregated statistics
   * Note: This method fetches all users and aggregates in memory to avoid Firebase composite index requirements
   */
  static async getNeighborhoodLeaderboard(): Promise<NeighborhoodStats[]> {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const neighborhoodMap = new Map<string, {
        totalPoints: number;
        totalRecycled: number;
        userCount: number;
      }>();

      // Aggregate data by neighborhood
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const neighborhood = userData.neighborhood;
        
        if (neighborhood) {
          const current = neighborhoodMap.get(neighborhood) || {
            totalPoints: 0,
            totalRecycled: 0,
            userCount: 0,
          };
          
          neighborhoodMap.set(neighborhood, {
            totalPoints: current.totalPoints + (userData.ecoPoints || 0),
            totalRecycled: current.totalRecycled + (userData.totalRecycled || 0),
            userCount: current.userCount + 1,
          });
        }
      });

      // Convert to array and calculate averages
      const neighborhoods: NeighborhoodStats[] = Array.from(neighborhoodMap.entries()).map(([name, data]) => ({
        name,
        totalPoints: data.totalPoints,
        totalRecycled: data.totalRecycled,
        userCount: data.userCount,
        averagePoints: Math.round(data.totalPoints / data.userCount),
        averageRecycled: Math.round(data.totalRecycled / data.userCount),
      }));

      // Sort by total points (overall impact)
      return neighborhoods.sort((a, b) => b.totalPoints - a.totalPoints);
    } catch (error) {
      console.error('Error fetching neighborhood leaderboard:', error);
      // Provide more specific error information for Firebase index issues
      if (error instanceof Error && error.message.includes('index')) {
        console.error('Firebase index error detected. This may require creating a composite index in the Firebase Console.');
        console.error('Required index: Collection: users, Fields: neighborhood (Ascending), ecoPoints (Descending)');
      }
      throw error;
    }
  }

  /**
   * Get top users from a specific neighborhood
   */
  static async getNeighborhoodTopUsers(neighborhood: string, limit: number = 10): Promise<NeighborhoodUser[]> {
    try {
      const usersRef = collection(db, 'users');
      // First get all users in the neighborhood, then sort in memory to avoid composite index requirement
      const q = query(
        usersRef,
        where('neighborhood', '==', neighborhood)
      );
      
      const querySnapshot = await getDocs(q);
      const users: NeighborhoodUser[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        } as NeighborhoodUser);
      });
      
      // Sort by ecoPoints in memory and limit results
      return users
        .sort((a, b) => b.ecoPoints - a.ecoPoints)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching neighborhood users:', error);
      // Provide more specific error information for Firebase index issues
      if (error instanceof Error && error.message.includes('index')) {
        console.error('Firebase index error detected. This may require creating a composite index in the Firebase Console.');
        console.error('Required index: Collection: users, Fields: neighborhood (Ascending), ecoPoints (Descending)');
      }
      throw error;
    }
  }

  /**
   * Get current month's winner neighborhood
   */
  static async getCurrentMonthWinner(): Promise<NeighborhoodStats | null> {
    try {
      const leaderboard = await this.getNeighborhoodLeaderboard();
      return leaderboard.length > 0 ? leaderboard[0] : null;
    } catch (error) {
      console.error('Error fetching current month winner:', error);
      throw error;
    }
  }

  /**
   * Get user's neighborhood ranking
   */
  static async getUserNeighborhoodRank(userId: string): Promise<{
    rank: number;
    totalUsers: number;
    neighborhood: string;
  } | null> {
    try {
      // Use doc() instead of query with __name__ to get a specific user document
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return null;
      
      const userData = userDoc.data();
      const neighborhood = userData.neighborhood;
      
      if (!neighborhood) return null;
      
      const neighborhoodUsers = await this.getNeighborhoodTopUsers(neighborhood, 1000);
      const userRank = neighborhoodUsers.findIndex(user => user.id === userId);
      
      if (userRank === -1) return null;
      
      return {
        rank: userRank + 1,
        totalUsers: neighborhoodUsers.length,
        neighborhood,
      };
    } catch (error) {
      console.error('Error fetching user neighborhood rank:', error);
      // Provide more specific error information for Firebase index issues
      if (error instanceof Error && error.message.includes('index')) {
        console.error('Firebase index error detected. This may require creating a composite index in the Firebase Console.');
        console.error('Required index: Collection: users, Fields: neighborhood (Ascending), ecoPoints (Descending)');
      }
      throw error;
    }
  }
}
