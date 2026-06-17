import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { MarketplaceStack } from './MarketplaceStack';
import { AuthStack } from './AuthStack';
import { ReservationsStack } from './ReservationsStack';
import { colors } from '../../shared/theme/colors';
import { typography } from '../../shared/theme/typography';
import type { RootTabParamList } from './types';
import { useAuth } from '../../shared/hooks/useAuth';
import { LoadingState } from '../../shared/components/LoadingState';
import { Screen } from '../../shared/components/Screen';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Marketplace: 'H',
    Reservas: 'R',
    Cuenta: 'U',
  };

  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>
        {icons[label] ?? 'JJ'}
      </Text>
    </View>
  );
}

export function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Screen>
        <LoadingState message="Validando sesion..." />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.label,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
          tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        })}
      >
        <Tab.Screen
          name="Marketplace"
          component={MarketplaceStack}
          options={{ title: 'Explorar' }}
        />
        <Tab.Screen name="Reservas" component={ReservationsStack} options={{ title: 'Reservas' }} />
        <Tab.Screen name="Cuenta" component={AuthStack} options={{ title: 'Cuenta' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 70,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 0,
    backgroundColor: colors.surface,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  tabBarItem: {
    gap: 2,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  iconActive: {
    backgroundColor: colors.primary,
  },
  iconText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  iconTextActive: {
    color: '#fff',
  },
});
