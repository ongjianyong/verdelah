import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { RecyclingBin } from '../services/geojson-loader';

interface NearestBinsListProps {
  bins: RecyclingBin[];
  onBinPress: (bin: RecyclingBin) => void;
  userLocation?: { latitude: number; longitude: number };
  onClose?: () => void;
}

interface BinWithDistance extends RecyclingBin {
  distance?: number;
}

const { width } = Dimensions.get('window');

export default function NearestBinsList({ 
  bins, 
  onBinPress, 
  userLocation, 
  onClose 
}: NearestBinsListProps) {
  
  const formatDistance = (distance?: number): string => {
    if (!distance) return 'Unknown';
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const getBinIcon = (type: string): string => {
    switch (type) {
      case 'paper': return '📄';
      case 'plastic': return '🥤';
      case 'glass': return '🍶';
      case 'metal': return '🥫';
      case 'mixed': return '♻️';
      default: return '♻️';
    }
  };

  const renderBinItem = ({ item, index }: { item: BinWithDistance; index: number }) => (
    <TouchableOpacity
      style={[
        styles.binItem,
        index === 0 && styles.firstBinItem // Highlight the closest bin
      ]}
      onPress={() => onBinPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.binHeader}>
        <View style={styles.binIconContainer}>
          <Text style={styles.binIcon}>{getBinIcon(item.type)}</Text>
        </View>
        <View style={styles.binInfo}>
          <Text style={styles.binName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.binAddress} numberOfLines={1}>
            {item.address}
          </Text>
          {item.buildingName && (
            <Text style={styles.buildingName} numberOfLines={1}>
              {item.buildingName}
            </Text>
          )}
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            {formatDistance(item.distance)}
          </Text>
          {index === 0 && (
            <Text style={styles.closestLabel}>Closest</Text>
          )}
        </View>
      </View>
      
      <View style={styles.binFooter}>
        <Text style={styles.binType}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Recycling
        </Text>
        <Text style={styles.tapHint}>Tap for details</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Nearest Recycling Bins</Text>
        <Text style={styles.headerSubtitle}>
          {bins.length} bins found within 10km
        </Text>
      </View>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🗺️</Text>
      <Text style={styles.emptyStateTitle}>No bins found nearby</Text>
      <Text style={styles.emptyStateSubtitle}>
        Try expanding your search radius or check back later
      </Text>
    </View>
  );

  if (bins.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={bins}
        renderItem={renderBinItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: The closest bin is highlighted in green
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e8f5e8',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  binItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  firstBinItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  binHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  binIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  binIcon: {
    fontSize: 20,
  },
  binInfo: {
    flex: 1,
    marginRight: 12,
  },
  binName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 2,
  },
  binAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  buildingName: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  distanceContainer: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  closestLabel: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  binFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  binType: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  tapHint: {
    fontSize: 12,
    color: '#2E7D32',
    fontStyle: 'italic',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
