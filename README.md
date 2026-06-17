# Hotel JJ Mobile

Prototipo React Native (Expo) para marketplace y reservas de Hotel JJ. Consume unicamente el BFF GraphQL desplegado en Azure.

## Requisitos

- Node.js 18+
- Expo CLI (`npx expo`)
- Acceso al endpoint GraphQL oficial:
  `https://hoteljj-graphql-api-amd5hxafbzd9exc2.brazilsouth-01.azurewebsites.net/graphql/`

## Configuracion GraphQL

Copia `.env.example` a `.env` si necesitas regenerar el archivo de entorno:

```env
EXPO_PUBLIC_GRAPHQL_URL=https://hoteljj-graphql-api-amd5hxafbzd9exc2.brazilsouth-01.azurewebsites.net/graphql/
```

La app usa `EXPO_PUBLIC_GRAPHQL_URL` desde `src/services/config.ts`. Si la variable no existe, el fallback tambien apunta al endpoint oficial de Azure.

React Native no se conecta a RabbitMQ ni a endpoints REST directos de los microservicios; toda operacion del marketplace/reservas pasa por GraphQL.

## Ejecutar la app

```powershell
cd HotelJJMobile
npm install
npm start
```

Luego:

- `a` - Android emulator
- `w` - Web
- Escanea el QR con Expo Go en dispositivo fisico

## Flujo implementado

1. **Home** - busqueda de alojamientos (`searchAccommodations`)
2. **Resultados** - listado en cards
3. **Detalle** - galeria, amenities, tipos de habitacion, resenas (`accommodation`, `accommodationReviews`)
4. **Checkout** - datos del huesped + resumen estimado
5. **Login / Registro** - GraphQL (`login`, `registerClient`)
6. **Confirmar reserva** - `createReservation`
7. **Confirmacion / Detalle** - datos del backend; recarga con `reservation(reservaGuid)` si hay JWT
8. **Mis reservas** - listado asociado al usuario con `myReservations`

## Pantallas

| Pantalla | Ubicacion |
|----------|-----------|
| HomeScreen | `src/features/marketplace/screens/` |
| SearchResultsScreen | `src/features/marketplace/screens/` |
| AccommodationDetailScreen | `src/features/marketplace/screens/` |
| ReviewsScreen | `src/features/marketplace/screens/` |
| CheckoutScreen | `src/features/reservations/screens/` |
| ReservationConfirmationScreen | `src/features/reservations/screens/` |
| ReservationDetailScreen | `src/features/reservations/screens/` |
| MyReservationsScreen | `src/features/reservations/screens/` |
| LoginScreen / RegisterScreen | `src/features/auth/screens/` |

## Queries / Mutations usadas

**Queries:** `searchAccommodations`, `accommodation`, `accommodationReviews`, `accommodationAvailability` (definida, opcional), `reservation`, `myReservations`

**Mutations:** `login`, `registerClient`, `createReservation`, `cancelReservation`, `refreshToken`, `logout`

## Brechas pendientes del BFF GraphQL

- `calculateReservationPrice` - precio oficial antes de confirmar
- `simulatePayment` - pago simulado

El checkout muestra precio estimado con IVA; el total oficial lo devuelve `createReservation`.

## Estructura

Sigue `Plan_ReactNative_mobil.md`:

```text
src/
  app/           # App, providers, navigation
  features/      # marketplace, reservations, auth
  shared/        # components, theme, utils, hooks
  services/      # apolloClient, config
```

## Problemas conocidos

- Overbooking/disponibilidad final la valida el backend al crear la reserva.
