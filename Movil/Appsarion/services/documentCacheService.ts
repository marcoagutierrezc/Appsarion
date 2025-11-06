import * as FileSystem from 'expo-file-system/legacy';

interface CachedDocument {
  userId: number;
  base64Data: string;
  contentType: string;
  filename: string;
  timestamp: number;
}

// Usar cualquier directorio disponible en FileSystem
const CACHE_DIR = `${(FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '.'}appsarion_doc_cache/`;
const CACHE_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 días en ms

/**
 * Inicializa el directorio de caché
 */
export const initializeCacheDirectory = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  } catch (error) {
    console.warn('Error inicializando caché:', error);
  }
};

/**
 * Obtiene el archivo en caché del documento del usuario
 */
export const getCachedDocument = async (
  userId: number
): Promise<CachedDocument | null> => {
  try {
    const cacheFile = `${CACHE_DIR}doc_${userId}.json`;
    const fileInfo = await FileSystem.getInfoAsync(cacheFile);

    if (!fileInfo.exists) {
      return null;
    }

    // Verificar si el caché está expirado
    const content = await FileSystem.readAsStringAsync(cacheFile);
    const cached: CachedDocument = JSON.parse(content);
    const now = Date.now();

    if (now - cached.timestamp > CACHE_EXPIRY_TIME) {
      // Caché expirado, eliminar
      await FileSystem.deleteAsync(cacheFile).catch(() => {});
      return null;
    }

    return cached;
  } catch (error) {
    console.warn('Error leyendo caché:', error);
    return null;
  }
};

/**
 * Guarda un documento en el caché
 */
export const cacheDocument = async (
  userId: number,
  base64Data: string,
  contentType: string,
  filename: string
): Promise<boolean> => {
  try {
    const cacheFile = `${CACHE_DIR}doc_${userId}.json`;

    const cached: CachedDocument = {
      userId,
      base64Data,
      contentType,
      filename,
      timestamp: Date.now(),
    };

    await FileSystem.writeAsStringAsync(
      cacheFile,
      JSON.stringify(cached)
    );

    return true;
  } catch (error) {
    console.warn('Error guardando en caché:', error);
    return false;
  }
};

/**
 * Elimina el documento en caché del usuario
 */
export const clearDocumentCache = async (userId: number): Promise<boolean> => {
  try {
    const cacheFile = `${CACHE_DIR}doc_${userId}.json`;
    const fileInfo = await FileSystem.getInfoAsync(cacheFile);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(cacheFile);
    }

    return true;
  } catch (error) {
    console.warn('Error limpiando caché:', error);
    return false;
  }
};

/**
 * Limpia todo el caché de documentos
 */
export const clearAllDocumentCache = async (): Promise<boolean> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(CACHE_DIR);
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
    return true;
  } catch (error) {
    console.warn('Error limpiando caché completo:', error);
    return false;
  }
};
