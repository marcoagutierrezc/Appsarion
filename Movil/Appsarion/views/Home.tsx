import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { commonColors, commonStyles } from '../styles/commonStyles';
import { useFontScale } from '../context/FontScaleContext';

const LogoApp = require('../assets/LogoName.png');

export function Home({ navigation }: { navigation: any }){
  const user = useSelector((state: RootState) => state.auth.user);
  const { fontScale, setFontScale } = useFontScale();
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [fontModalVisible, setFontModalVisible] = useState(false);
  const tapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleLogoTap = () => {
    // Cancelar el timeout anterior si existe
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    setLogoTapCount(prev => {
      const newCount = prev + 1;
      
      if (newCount === 5) {
        setFontModalVisible(true);
        setLogoTapCount(0);
        return 0;
      }
      
      // Reset count after 2 seconds of no taps
      tapTimeoutRef.current = setTimeout(() => {
        setLogoTapCount(0);
      }, 2000);
      
      return newCount;
    });
  };

  const saveFontScale = async (scale: number) => {
    try {
      await setFontScale(scale);
      setFontModalVisible(false);
    } catch (error) {
      console.error('Error saving font scale:', error);
    }
  };

  // Escuchar cambios globales de font scale
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // fontScale se carga automáticamente del contexto
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={handleLogoTap} activeOpacity={0.7}>
            <Image source={LogoApp} style={[styles.logo, { width: 120 * fontScale, height: 120 * fontScale }]} />
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfoItem}>
            <MaterialCommunityIcons name="account-circle" size={24 * fontScale} color={commonColors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { fontSize: 12 * fontScale }]}>Nombre de Usuario</Text>
              <Text style={[styles.value, { fontSize: 16 * fontScale }]}>{user?.name ?? 'No disponible'}</Text>
            </View>
          </View>

          <View style={commonStyles.divider} />

          <View style={styles.userInfoItem}>
            <MaterialCommunityIcons name="briefcase" size={24 * fontScale} color={commonColors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { fontSize: 12 * fontScale }]}>Rol</Text>
              <Text style={[styles.value, { fontSize: 16 * fontScale }]}>{user?.role ?? 'No disponible'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Font Size Modal */}
      <Modal visible={fontModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: 18 * fontScale }]}>Tamaño de Fuente</Text>
            
            <View style={styles.fontOptionsContainer}>
              {[0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5].map((scale) => (
                <TouchableOpacity
                  key={scale}
                  style={[
                    styles.fontOption,
                    fontScale === scale && styles.fontOptionActive
                  ]}
                  onPress={() => saveFontScale(scale)}
                >
                  <Text style={[
                    styles.fontOptionText,
                    { fontSize: 14 * scale },
                    fontScale === scale && styles.fontOptionTextActive
                  ]}>
                    {scale === 0.7 ? 'Muy Pequeño' : scale === 0.8 ? 'Pequeño' : scale === 0.9 ? 'Mediano' : scale === 1 ? 'Normal' : scale === 1.1 ? 'Grande' : scale === 1.2 ? 'Muy Grande' : scale === 1.3 ? 'Extra Grande' : scale === 1.4 ? 'Gigante' : 'Máximo'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={commonStyles.buttonPrimary}
              onPress={() => setFontModalVisible(false)}
            >
              <Text style={commonStyles.buttonPrimaryText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  scrollView: {
    flex: 1,
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

  /* Font Size Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: commonColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  fontOptionsContainer: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  fontOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: commonColors.border,
    backgroundColor: '#f8f9fa',
  },
  fontOptionActive: {
    borderColor: commonColors.primary,
    backgroundColor: commonColors.primary + '15',
  },
  fontOptionText: {
    fontWeight: '500',
    color: commonColors.textPrimary,
    textAlign: 'center',
  },
  fontOptionTextActive: {
    color: commonColors.primary,
    fontWeight: '700',
  },
});

export default Home;