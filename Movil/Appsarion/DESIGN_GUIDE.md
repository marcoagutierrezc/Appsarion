# 🎨 Guía de Diseño - Appsarion Mobile

## Visión General

Todas las pantallas de la aplicación deben seguir un diseño profesional y consistente basado en los estilos definidos en `styles/commonStyles.ts`.

## 📋 Cambios Implementados

### ✅ Módulos Actualizados

1. **Auth (Autenticación)**
   - ✅ LoginView.tsx - Diseño profesional con header azul
   - ✅ PasswordRecoveryView.tsx - Flujo de recuperación mejorado
   - ✅ RegisterDataView.tsx - Registro paso 1 con barra de progreso
   - ✅ RegisterRoleDataView.tsx - Registro paso 2 con indicadores
   - ✅ RegisterConfirmationView.tsx - Pantalla de éxito mejorada

2. **Home Module**
   - ✅ Home.tsx - Pantalla de inicio con información del usuario

3. **Training Module**
   - ✅ TrainingView.tsx - Categorías de capacitación con nuevo diseño

### ⏳ Módulos Pendientes de Actualizar

Los siguientes módulos deben actualizarse siguiendo el mismo patrón:

- [ ] **Evaluation Module** (`views/evaluation/`)
- [ ] **CRUD Module** (`views/crud/`)
- [ ] **Tests/Exams** (`training/ExamPreview.tsx`, `QuizView.tsx`)
- [ ] **Register Fish Lots** (`views/registerLotFishs/`)
- [ ] **Verification Module** (`views/verification/`)

## 🎯 Patrón de Diseño

### Colores Base

```typescript
primary: '#0066cc'      // Azul profesional
success: '#28a745'      // Verde
danger: '#dc3545'       // Rojo
warning: '#ff9800'      // Naranja
background: '#f8f9fa'   // Gris muy claro
cardBackground: '#fff'  // Blanco
```

### Estructura de Pantalla Estándar

```tsx
import { commonColors, commonStyles } from '../styles/commonStyles';

export function MyView({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Título</Text>
        <Text style={styles.headerSubtitle}>Subtítulo</Text>
      </View>

      {/* Main Content */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        {/* Content Here */}
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
  header: {
    backgroundColor: commonColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
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
});
```

### Componentes Comunes

#### Botón Primario
```tsx
<TouchableOpacity style={commonStyles.buttonPrimary} onPress={handlePress}>
  <MaterialCommunityIcons name="check" size={18} color="#fff" style={{ marginRight: 6 }} />
  <Text style={commonStyles.buttonPrimaryText}>Guardar</Text>
</TouchableOpacity>
```

#### Botón Secundario
```tsx
<TouchableOpacity style={commonStyles.buttonSecondary} onPress={handlePress}>
  <Text style={commonStyles.buttonSecondaryText}>Cancelar</Text>
</TouchableOpacity>
```

#### Input Group
```tsx
<View style={commonStyles.inputGroup}>
  <MaterialCommunityIcons name="email-outline" size={20} color={commonColors.primary} style={commonStyles.inputIcon} />
  <TextInput
    style={commonStyles.input}
    placeholder="Tu email"
    placeholderTextColor="#aaa"
  />
</View>
```

#### Card
```tsx
<View style={commonStyles.card}>
  <Text style={{ fontSize: 16, fontWeight: '600', color: commonColors.textPrimary }}>
    Contenido de la tarjeta
  </Text>
</View>
```

## 📱 Logos

- **Logo en pantalla de login**: Sin bordes redondeados, sin fondo
- **Logo en otros módulos**: Adaptarse al contexto, mantener claridad

## 📧 Configuración por Variables de Entorno

Para configuración global como email de soporte:

```typescript
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || 'soporte@appsarion.com';
```

Configurar en `.env`:
```
EXPO_PUBLIC_SUPPORT_EMAIL=tu@email.com
```

## ✨ Características Diseñadas

✅ Header profesional con color primario (#0066cc)
✅ Cards con bordes sutiles y sombras
✅ Iconos MaterialCommunityIcons consistentes
✅ Buttons con estados visuales claros
✅ Input fields con iconos integrados
✅ Espaciado consistente (8px, 12px, 16px, 20px)
✅ Tipografía jerárquica clara
✅ ScrollViews con padding adecuado
✅ Dividers sutiles
✅ Estados de carga con ActivityIndicator
✅ Validación visual con iconos check/alert

## 🚀 Próximos Pasos

1. Actualizar módulos de Evaluación, CRUD, Pruebas
2. Aplicar estilos comunes en toda la app
3. Crear componentes reutilizables para headers, cards, buttons
4. Documentar todas las pantallas completadas
5. Hacer testing en emulador/dispositivo real

## 📝 Notas Importantes

- Importar siempre `commonColors` y `commonStyles` desde `styles/commonStyles`
- Usar `ScrollView` con `contentContainerStyle` para layouts con altura flexible
- Mantener padding consistente: `paddingHorizontal: 20`
- Usar `MaterialCommunityIcons` para todos los iconos
- Mantener el color primario #0066cc para headers y elementos principales
