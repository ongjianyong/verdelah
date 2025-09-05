export interface MonthlyResetInfo {
  nextResetDate: Date;
  daysUntilReset: number;
  hoursUntilReset: number;
  minutesUntilReset: number;
  isNewMonth: boolean;
}

export class MonthlyResetService {
  private static readonly RESET_DAY = 1; // Reset on the 1st of every month
  private static readonly RESET_HOUR = 0; // Reset at midnight

  /**
   * Get the next reset date (1st of next month at midnight)
   */
  static getNextResetDate(): Date {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, this.RESET_DAY, this.RESET_HOUR, 0, 0, 0);
    return nextMonth;
  }

  /**
   * Get the current month's start date
   */
  static getCurrentMonthStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }

  /**
   * Check if we're in a new month since the last reset
   */
  static isNewMonth(lastResetDate: Date): boolean {
    const currentMonthStart = this.getCurrentMonthStart();
    return currentMonthStart > lastResetDate;
  }

  /**
   * Get detailed countdown information until next reset
   */
  static getCountdownInfo(): MonthlyResetInfo {
    const now = new Date();
    const nextReset = this.getNextResetDate();
    const timeDiff = nextReset.getTime() - now.getTime();

    const daysUntilReset = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursUntilReset = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesUntilReset = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return {
      nextResetDate: nextReset,
      daysUntilReset,
      hoursUntilReset,
      minutesUntilReset,
      isNewMonth: this.isNewMonth(this.getCurrentMonthStart()),
    };
  }

  /**
   * Format countdown as a readable string
   */
  static getCountdownString(): string {
    const countdown = this.getCountdownInfo();
    
    if (countdown.daysUntilReset > 0) {
      return `${countdown.daysUntilReset} day${countdown.daysUntilReset !== 1 ? 's' : ''} until reset`;
    } else if (countdown.hoursUntilReset > 0) {
      return `${countdown.hoursUntilReset} hour${countdown.hoursUntilReset !== 1 ? 's' : ''} until reset`;
    } else if (countdown.minutesUntilReset > 0) {
      return `${countdown.minutesUntilReset} minute${countdown.minutesUntilReset !== 1 ? 's' : ''} until reset`;
    } else {
      return 'Resetting now...';
    }
  }

  /**
   * Get the current month/year string for display
   */
  static getCurrentMonthString(): string {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  /**
   * Get the next month/year string for display
   */
  static getNextMonthString(): string {
    const nextReset = this.getNextResetDate();
    return nextReset.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  /**
   * Check if leaderboard should be reset (called periodically)
   */
  static shouldReset(lastResetDate: Date): boolean {
    return this.isNewMonth(lastResetDate);
  }
}
