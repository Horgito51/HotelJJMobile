import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../../features/marketplace/screens/HomeScreen';
import { SearchResultsScreen } from '../../features/marketplace/screens/SearchResultsScreen';
import { AccommodationDetailScreen } from '../../features/marketplace/screens/AccommodationDetailScreen';
import { ReviewsScreen } from '../../features/marketplace/screens/ReviewsScreen';
import { colors } from '../../shared/theme/colors';
import type { MarketplaceStackParamList } from './types';

const Stack = createNativeStackNavigator<MarketplaceStackParamList>();

export function MarketplaceStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primaryDark,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Hotel JJ' }} />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: 'Resultados' }}
      />
      <Stack.Screen
        name="AccommodationDetail"
        component={AccommodationDetailScreen}
        options={{ title: 'Detalle' }}
      />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'Reseñas' }} />
    </Stack.Navigator>
  );
}
