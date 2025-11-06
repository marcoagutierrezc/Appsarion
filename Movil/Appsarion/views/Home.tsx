import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { commonColors, commonStyles } from '../styles/commonStyles';

const LogoApp = require('../assets/LogoName.png');

export function Home({ navigation }: { navigation: any }){
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={LogoApp} style={styles.logo} />
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userInfoItem}>
          <MaterialCommunityIcons name="account-circle" size={24} color={commonColors.primary} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Nombre de Usuario</Text>
            <Text style={styles.value}>{user?.name ?? 'No disponible'}</Text>
          </View>
        </View>

        <View style={commonStyles.divider} />

        <View style={styles.userInfoItem}>
          <MaterialCommunityIcons name="briefcase" size={24} color={commonColors.primary} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Rol</Text>
            <Text style={styles.value}>{user?.role ?? 'No disponible'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  /* Logo Container */
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },

  /* User Card */
  userCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: commonColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: commonColors.textPrimary,
  },
});

export default Home;