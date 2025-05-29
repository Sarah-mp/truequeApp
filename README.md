# TrueQ - Aplicación de Trueque

TrueQ es una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios realizar intercambios de productos de manera segura y eficiente.

## 🏗️ Estructura del Proyecto

```
truequeApp/
├── app/                    # Páginas principales de la aplicación
├── components/            # Componentes reutilizables
├── config/               # Configuraciones (Firebase, etc.)
├── domain/              # Lógica de negocio
│   ├── interfaces/     # Interfaces y tipos
│   └── servicios/      # Servicios de la aplicación
├── infraestructure/    # Adaptadores y configuraciones de infraestructura
└── assets/            # Recursos estáticos (imágenes, fuentes, etc.)
```

## 🚀 Tecnologías Principales

- React Native
- Expo
- TypeScript
- Firebase (Autenticación, Firestore, Storage)
- React Navigation
- React Native Paper

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 14 o superior)
- npm o yarn
-Firestore (`npm intall firebase@9.13.0`)
- Expo CLI (`npm install -g expo-cli`)
- Git

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd truequeApp
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilita Authentication, Firestore y Storage
   - Descarga el archivo de configuración `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
   - Coloca los archivos en las carpetas correspondientes:
     - Android: `android/app/google-services.json`
     - iOS: `ios/GoogleService-Info.plist`

4. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega las credenciales de Firebase:
```
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_auth_domain
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
FIREBASE_APP_ID=tu_app_id
```
5. librerias o modulos del react-native como:
   - react-native-paper
   - Materiali
   -etc.

## 🏃‍♂️ Ejecución

1. Inicia el servidor de desarrollo:
```bash
npx expo start
# o
yarn expo start
```

2. Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil o presiona:
   - `a` para abrir en un emulador de Android
   - `i` para abrir en un simulador de iOS

## 📱 Características Principales

- Autenticación de usuarios
- Perfil de usuario personalizable
- Publicación de productos para trueque
- Sistema de likes y matches
- Notificaciones en tiempo real
- Gestión de imágenes y multimedia

## 🔐 Base de Datos

La aplicación utiliza Firebase como backend. Para que el proyecto funcione correctamente, necesitas:

1. Crear un proyecto en Firebase
2. Configurar las siguientes colecciones en Firestore:
   - `Usuario`: Información de usuarios
   - `productos`: Productos para trueque
   - `likes`: Sistema de likes
   - `matches`: Coincidencias entre usuarios


## 📦 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run android`: Ejecuta la app en Android
- `npm run ios`: Ejecuta la app en iOS
- `npm run web`: Ejecuta la app en web
- `npm run build`: Genera la build de producción

## 🤝 Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes alguna sugerencia, por favor abre un issue en el repositorio.

## ⚠️ Notas Importantes

- La aplicación requiere una conexión a internet para funcionar
- Las imágenes se almacenan en Firebase Storage
- Los datos de usuario se sincronizan en tiempo real
- Se recomienda usar la última versión de Expo Go para probar la aplicación
