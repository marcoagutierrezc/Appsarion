import { StyleSheet } from 'react-native';

/**
 * Estilos comunes reutilizables en toda la aplicación
 */
export const commonColors = {
  primary: '#0066cc',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ff9800',
  info: '#17a2b8',
  background: '#f8f9fa',
  cardBackground: '#fff',
  textPrimary: '#1a1a1a',
  textSecondary: '#666',
  textTertiary: '#999',
  border: '#e0e0e0',
  divider: '#f0f0f0',
};

export const commonStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // Headers
  header: {
    backgroundColor: commonColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerContent: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },

  // Cards
  card: {
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

  // Buttons
  buttonPrimary: {
    backgroundColor: commonColors.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: commonColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonSecondary: {
    backgroundColor: '#f0f5ff',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: commonColors.primary,
  },
  buttonSecondaryText: {
    color: commonColors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  buttonSuccess: {
    backgroundColor: commonColors.success,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: commonColors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonSuccessText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDanger: {
    backgroundColor: commonColors.danger,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: commonColors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDangerText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Inputs
  input: {
    flex: 1,
    fontSize: 16,
    color: commonColors.textPrimary,
    padding: 0,
    fontWeight: '500',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: commonColors.border,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },

  // Text
  textLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: commonColors.textPrimary,
  },
  textMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: commonColors.textPrimary,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '400',
    color: commonColors.textSecondary,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: commonColors.divider,
    marginVertical: 12,
  },
});
