import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/features/auth/store';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isRestoringSession = useAuthStore((s) => s.isRestoringSession);

  if (isRestoringSession) {
    return null;
  }

  // Auth Guard
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 1,
          shadowOpacity: 0.05,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: '#065f46',
          fontSize: 18,
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="commuter"
        options={{
          title: 'Nebeng-Jastip',
          headerTitle: 'Rute Komuter & Jastip Pekon',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'car' : 'car-outline'}
              size={24}
              color={typeof color === 'string' ? color : '#059669'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Bursa & Job',
          headerTitle: 'Bursa Panen & Mini-Job Inklusif',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'basket' : 'basket-outline'}
              size={24}
              color={typeof color === 'string' ? color : '#059669'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="verify"
        options={{
          title: 'Validasi PoW',
          headerTitle: 'Selfie Proof-of-Work',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'camera' : 'camera-outline'}
              size={24}
              color={typeof color === 'string' ? color : '#059669'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil & Dompet',
          headerTitle: 'Akun & Skor Kredit BUMDes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={24}
              color={typeof color === 'string' ? color : '#059669'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
