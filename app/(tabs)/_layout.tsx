import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from "expo-navigation-bar";
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {

   useEffect(() => {
    if(Platform.OS == "android"){
        NavigationBar.setBackgroundColorAsync("#000000");
        NavigationBar.setButtonStyleAsync("light");
    }
   },[])
      
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.grey,
            tabBarStyle: {
                backgroundColor: COLORS.background,
                borderTopWidth: 0,
                position: "absolute",
                elevation: 0,
                height: 40,
                paddingBottom: 8,
            }
        }}>
        <Tabs.Screen
            name="index"
            options={{
                tabBarIcon: ({size,color}) => <Ionicons name="home" size={size} color={color}/>
            }}
        />
        <Tabs.Screen
            name="bookmarks"
            options={{
                tabBarIcon: ({size,color}) => <Ionicons name="bookmark" size={size} color={color}/>
            }}
        />
        <Tabs.Screen
            name="create"
            options={{
                tabBarIcon: ({size,color}) => <Ionicons name="add-circle" size={size} color={color}/>
            }}
        />
        <Tabs.Screen
            name="notifications"
            options={{
                tabBarIcon: ({size,color}) => <Ionicons name="heart" size={size} color={color}/>
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                tabBarIcon: ({size,color}) => <Ionicons name="person-circle" size={size} color={color}/>
            }}
        />
    </Tabs>
  )
}