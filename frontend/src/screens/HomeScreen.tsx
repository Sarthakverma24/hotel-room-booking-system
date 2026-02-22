import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Ionicons, 
  MaterialCommunityIcons, 
  FontAwesome5,
  Feather 
} from '@expo/vector-icons';
import { supabase } from '../api/supabase';

const { width } = Dimensions.get('window');

// Real data will be fetched from Supabase
const FEATURED_PRODUCTS = [];
const CATEGORIES = [];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen({ navigation }) {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [favorites, setFavorites] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [userName, setUserName] = useState('Creator');

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    fetchUserName();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchUserName = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      setUserName(profile?.full_name || user.email?.split('@')[0] || 'Creator');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserName();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-20, 0],
    extrapolate: 'clamp',
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={12} color="#D4A574" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<Ionicons key={i} name="star-half" size={12} color="#D4A574" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={12} color="#D4A574" />);
      }
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF8F3" />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <BlurView intensity={80} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Sutreya</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="search-outline" size={22} color="#5C4A3A" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <View style={styles.cartBadge}>
                  <Ionicons name="bag-outline" size={22} color="#5C4A3A" />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#D4A574"
            colors={['#D4A574']}
          />
        }
        style={{ opacity: fadeAnim }}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#FDF8F3', '#F5EBE0', '#E8D5C4']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              styles.heroContent,
              {
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }
            ]}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#D4A574', '#C49564']}
                style={styles.logoCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="pottery" size={36} color="#fff" />
              </LinearGradient>
              <View style={styles.logoGlow} />
            </View>

            {/* Greeting */}
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{greeting}, {userName}</Text>
              <View style={styles.greetingLine} />
            </View>

            {/* Title */}
            <Text style={styles.heroTitle}>
              Discover{'\n'}
              <Text style={styles.heroTitleAccent}>Handcrafted</Text>{'\n'}
              Perfection
            </Text>

            <Text style={styles.heroSubtitle}>
              Connect with artisans and find unique homemade treasures crafted with love
            </Text>

            {/* CTA Button */}
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Paywall')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#D4A574', '#C49564', '#B8956A']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.ctaText}>Unlock Premium</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Decorative Elements */}
          <View style={[styles.floatingCircle, styles.circle1]} />
          <View style={[styles.floatingCircle, styles.circle2]} />
          <View style={[styles.floatingCircle, styles.circle3]} />
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <Text style={styles.sectionSubtitle}>Find your perfect craft</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAll}>See All</Text>
              <Ionicons name="arrow-forward" size={16} color="#D4A574" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            decelerationRate="fast"
            snapToInterval={88}
            snapToAlignment="start"
          >
            {CATEGORIES.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryCard,
                  activeCategory === index && styles.categoryCardActive
                ]}
                activeOpacity={0.8}
                onPress={() => setActiveCategory(activeCategory === index ? null : index)}
              >
                <LinearGradient
                  colors={category.gradient}
                  style={[
                    styles.categoryIcon,
                    activeCategory === index && styles.categoryIconActive
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons 
                    name={category.icon} 
                    size={28} 
                    color="#fff" 
                  />
                </LinearGradient>
                <Text style={[
                  styles.categoryName,
                  activeCategory === index && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
                {activeCategory === index && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Featured Creations</Text>
              <Text style={styles.sectionSubtitle}>Handpicked for you</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAll}>Explore</Text>
              <Ionicons name="arrow-forward" size={16} color="#D4A574" />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {FEATURED_PRODUCTS.map((product, index) => (
              <AnimatedTouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  index % 2 === 1 && { marginLeft: 12 }
                ]}
                activeOpacity={0.95}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                {/* Image Container */}
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  
                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageOverlay}
                  />

                  {/* Tag */}
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{product.tag}</Text>
                  </View>

                  {/* Favorite Button */}
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(product.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons 
                      name={favorites[product.id] ? "heart" : "heart-outline"} 
                      size={18} 
                      color={favorites[product.id] ? "#D4A574" : "#5C4A3A"} 
                    />
                  </TouchableOpacity>

                  {/* Quick Add */}
                  <TouchableOpacity style={styles.quickAddButton}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                  <View style={styles.sellerRow}>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={12} color="#D4A574" />
                    </View>
                    <Text style={styles.sellerName}>{product.seller}</Text>
                  </View>

                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>

                  <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                      {renderStars(product.rating)}
                    </View>
                    <Text style={styles.reviewCount}>({product.reviews})</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.addButton}>
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </View>

        {/* Become a Seller Banner */}
        <View style={styles.sellerBannerSection}>
          <LinearGradient
            colors={['#2C1810', '#4A3728', '#5C4A3A']}
            style={styles.sellerBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sellerContent}>
              <View style={styles.sellerIconContainer}>
                <LinearGradient
                  colors={['#D4A574', '#C49564']}
                  style={styles.sellerIcon}
                >
                  <MaterialCommunityIcons name="storefront" size={32} color="#fff" />
                </LinearGradient>
              </View>
              
              <View style={styles.sellerText}>
                <Text style={styles.sellerTitle}>Become a Seller</Text>
                <Text style={styles.sellerSubtitle}>
                  Turn your passion into profit. Join our community of artisans.
                </Text>
              </View>

              <TouchableOpacity style={styles.sellerButton}>
                <Text style={styles.sellerButtonText}>Start Selling</Text>
                <Ionicons name="arrow-forward" size={18} color="#2C1810" />
              </TouchableOpacity>
            </View>

            {/* Decorative Pattern */}
            <View style={styles.patternOverlay} />
          </LinearGradient>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.bottomNavContent}>
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconActive}>
              <Ionicons name="home" size={22} color="#fff" />
            </View>
            <Text style={styles.navLabelActive}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Ionicons name="compass-outline" size={24} color="#A89B8C" />
            </View>
            <Text style={styles.navLabel}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemCenter}>
            <LinearGradient
              colors={['#2C1810', '#4A3728']}
              style={styles.navCenterButton}
            >
              <Ionicons name="bag-add" size={26} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Ionicons name="heart-outline" size={24} color="#A89B8C" />
            </View>
            <Text style={styles.navLabel}>Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Ionicons name="person-outline" size={24} color="#A89B8C" />
            </View>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8F3',
  },
  
  // Header Styles
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
  },
  headerBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C1810',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 165, 116, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#D4A574',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDF8F3',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // Hero Section
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 100 : 90,
    paddingBottom: 50,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 165, 116, 0.2)',
    top: -18,
    left: -18,
    zIndex: -1,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 15,
    color: '#8B7355',
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  greetingLine: {
    width: 40,
    height: 3,
    backgroundColor: '#D4A574',
    borderRadius: 2,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2C1810',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 16,
  },
  heroTitleAccent: {
    color: '#D4A574',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22,
    fontWeight: '500',
  },
  ctaButton: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    gap: 10,
  },
  ctaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  // Floating Circles
  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(212, 165, 116, 0.08)',
  },
  circle1: {
    width: 180,
    height: 180,
    top: 40,
    right: -60,
  },
  circle2: {
    width: 120,
    height: 120,
    bottom: 80,
    left: -40,
  },
  circle3: {
    width: 80,
    height: 80,
    top: 150,
    left: 20,
  },

  // Section Styles
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '500',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAll: {
    fontSize: 13,
    color: '#D4A574',
    fontWeight: '700',
  },

  // Categories
  categoriesContainer: {
    paddingRight: 24,
    gap: 16,
  },
  categoryCard: {
    alignItems: 'center',
    width: 72,
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryIconActive: {
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  categoryName: {
    fontSize: 12,
    color: '#5C4A3A',
    fontWeight: '600',
  },
  categoryNameActive: {
    color: '#D4A574',
    fontWeight: '700',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4A574',
    marginTop: 6,
  },

  // Products Grid
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    height: 180,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  tagContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#D4A574',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 165, 116, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 16,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 165, 116, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 11,
    color: '#8B7355',
    fontWeight: '600',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
    lineHeight: 19,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCount: {
    fontSize: 11,
    color: '#8B7355',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D4A574',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Seller Banner
  sellerBannerSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sellerBanner: {
    borderRadius: 28,
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  sellerContent: {
    zIndex: 10,
  },
  sellerIconContainer: {
    marginBottom: 16,
  },
  sellerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sellerText: {
    marginBottom: 20,
  },
  sellerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  sellerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    fontWeight: '500',
  },
  sellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  sellerButtonText: {
    color: '#2C1810',
    fontWeight: '800',
    fontSize: 15,
  },
  patternOverlay: {
    position: 'absolute',
    right: -50,
    top: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
  },

  // Bottom Navigation
  bottomSpacing: {
    height: 100,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 20,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  navIconActive: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navLabelActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D4A574',
  },
  navLabel: {
    fontSize: 11,
    color: '#A89B8C',
    fontWeight: '600',
  },
  navItemCenter: {
    marginTop: -30,
  },
  navCenterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FDF8F3',
  },
});