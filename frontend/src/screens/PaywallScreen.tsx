import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRevenueCat } from '../context/RevenueCatContext';
import Purchases from 'react-native-purchases';

export default function PaywallScreen() {
  const { purchasePackage } = useRevenueCat();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Purchases.getOfferings().then(offerings => {
      setPackages(offerings.current?.availablePackages || []);
      setLoading(false);
    });
  }, []);

  const handlePurchase = async (pkg: any) => {
    await purchasePackage(pkg);
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade to Premium</Text>
      {packages.map(pkg => (
        <TouchableOpacity key={pkg.identifier} style={styles.card} onPress={() => handlePurchase(pkg)}>
          <Text style={styles.packageTitle}>{pkg.product.title}</Text>
          <Text style={styles.price}>{pkg.product.priceString}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loader: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 16 },
  packageTitle: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 20, color: '#D4A574', marginTop: 8 },
});
