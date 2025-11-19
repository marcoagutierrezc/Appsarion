import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Production backend URL (Render)
const PROD_URL = 'https://appsarion.onrender.com';

// Tries to build a local URL to your backend on port 8080 when running in dev
function getLocalBaseUrl() {
	// Optional manual override via Expo public env var
	// Set EXPO_PUBLIC_API_BASE=http://<tu-ip>:8080 si quieres forzarlo
	const override = process.env.EXPO_PUBLIC_API_BASE;
	if (override && typeof override === 'string') {
		return override;
	}

	// Derivar la IP local desde el hostUri/debuggerHost de Expo (modo desarrollo)
	const host = (Constants?.expoConfig?.hostUri) || (Constants?.manifest?.debuggerHost) || '';
	if (host) {
		const hostName = host.split(':')[0];
		return `http://${hostName}:8080`;
	}

	// Fallbacks para emuladores
	if (Platform.OS === 'android') return 'http://10.0.2.2:8080';
	return 'http://localhost:8080';
}

export const BASE_URL = __DEV__ ? getLocalBaseUrl() : PROD_URL;