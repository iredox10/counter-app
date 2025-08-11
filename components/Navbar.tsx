
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: 'home-outline' },
    { href: '/today', label: 'Today', icon: 'list-outline' },
    { href: '/stats', label: 'Stats', icon: 'stats-chart-outline' },
  ];

  return (
    <View className="sticky bottom-0 left-0 right-0 bg-[#1E1E1E] bg-opacity-80 backdrop-blur-lg border-t border-t-gray-700">
      <View className="max-w-2xl mx-auto flex-row justify-around items-center p-2">
        {navItems.map(item => (
          <Link href={item.href} asChild key={item.href}>
            <TouchableOpacity
              className={`flex flex-col items-center justify-center w-24 p-2 rounded-lg transition-colors ${pathname === item.href ? 'text-[#34D399]' : 'text-gray-400'}`}
            >
              <Ionicons name={item.icon} size={24} color={pathname === item.href ? '#34D399' : 'gray'} />
              <Text className={`text-xs font-medium ${pathname === item.href ? 'text-[#34D399]' : 'text-gray-400'}`}>{item.label}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
};

export default Navbar;
