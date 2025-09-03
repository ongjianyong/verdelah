# 🏆 Neighborhood Challenge Feature

## Overview
The Neighborhood Challenge feature promotes community-level recycling competitions, allowing entire districts in Singapore to compete for the title of "Greenest Neighborhood of the Month" based on recycling rates per capita.

## Features

### 1. Neighborhood Registration
- Users must select their neighborhood during registration
- 31 Singapore neighborhoods available (Ang Mo Kio, Bedok, Bishan, etc.)
- Neighborhood information is stored in user profiles

### 2. Community Competition
- **Per Capita Ranking**: Neighborhoods are ranked by average eco points per user
- **Monthly Challenges**: Competition resets monthly for fresh engagement
- **Real-time Updates**: Leaderboards update as users earn points

### 3. User Experience
- **Personal Ranking**: Users see their rank within their neighborhood
- **Neighborhood Status**: View neighborhood's overall performance
- **Community Pride**: Users can see how their neighborhood compares to others

### 4. Leaderboard Integration
- **Individual Rankings**: Traditional user-based leaderboards
- **Neighborhood Rankings**: New neighborhood-based competition view
- **Tabbed Interface**: Easy switching between different leaderboard types

## Technical Implementation

### Database Structure
```typescript
interface UserData {
  name: string;
  email: string;
  ecoPoints: number;
  totalRecycled: number;
  joinDate: string;
  level: number;
  neighborhood: string; // NEW FIELD
}
```

### Services
- **NeighborhoodLeaderboardService**: Handles all neighborhood-related calculations
- **Aggregation**: Calculates total points, user counts, and averages per neighborhood
- **Ranking**: Sorts neighborhoods by average points per capita

### Components
- **NeighborhoodChallenge**: Main challenge display component
- **Updated Leaderboard**: Enhanced with neighborhood tab
- **Profile Editor**: Allows users to update neighborhood information

## User Flow

1. **Registration**: User selects neighborhood during signup
2. **Earning Points**: User accumulates eco points through recycling activities
3. **Community Impact**: Points contribute to neighborhood's total score
4. **Competition**: Neighborhoods compete for monthly championship
5. **Recognition**: Winners and rankings are displayed prominently

## Benefits

### For Users
- **Community Connection**: Feel part of a larger eco-movement
- **Motivation**: Compete with neighbors for environmental goals
- **Recognition**: See personal contribution to neighborhood success

### For Communities
- **Environmental Impact**: Increased recycling participation
- **Social Cohesion**: Shared goals bring neighbors together
- **Recognition**: Neighborhood pride in environmental achievements

## Future Enhancements

### Planned Features
- **Eco-Circles**: Themed groups within neighborhoods (e.g., "Green Warriors of Tampines")
- **Monthly Rewards**: Special recognition for winning neighborhoods
- **Community Events**: Organized recycling drives and challenges
- **Progress Tracking**: Historical performance data and trends

### Technical Improvements
- **Caching**: Optimize leaderboard calculations for performance
- **Real-time Updates**: Live updates as users earn points
- **Analytics**: Detailed insights into neighborhood performance patterns

## Usage

### For Developers
1. **Install Dependencies**: `npm install @react-native-picker/picker`
2. **Database Setup**: Ensure user documents include neighborhood field
3. **Service Integration**: Use NeighborhoodLeaderboardService for data

### For Users
1. **Set Neighborhood**: Choose neighborhood during registration or in profile
2. **Earn Points**: Recycle items to contribute to neighborhood score
3. **View Rankings**: Check neighborhood performance in Challenge tab
4. **Compete**: Work with neighbors to win monthly championship

## Configuration

### Singapore Neighborhoods
The system includes 31 official Singapore neighborhoods:
- Ang Mo Kio, Bedok, Bishan, Boon Lay, Bukit Batok
- Bukit Merah, Bukit Panjang, Bukit Timah, Central Area
- Choa Chu Kang, Clementi, Geylang, Hougang, Jurong East
- Jurong West, Kallang, Lim Chu Kang, Mandai, Marine Parade
- Novena, Pasir Ris, Punggol, Queenstown, Sembawang
- Sengkang, Serangoon, Tampines, Tanglin, Toa Payoh
- Woodlands, Yishun

### Customization
- Add new neighborhoods by updating the `SINGAPORE_NEIGHBORHOODS` array
- Modify ranking algorithms in `NeighborhoodLeaderboardService`
- Customize UI components for different competition styles

## Support

For technical support or feature requests related to the Neighborhood Challenge:
1. Check the main project README for general setup
2. Review the service implementation in `services/neighborhood-leaderboard.ts`
3. Examine component usage in the Challenge tab and leaderboard

---

*This feature promotes community engagement and environmental responsibility through friendly competition and shared goals.* 🌱🏆
