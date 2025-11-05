import React, { useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableWithoutFeedback, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function Card({ title, children, style, onPress }: CardProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const content = (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: '#000',
          transform: [{ scale }],
        },
        style,
      ]}
    >
      {title ? <Text style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableWithoutFeedback
        onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start()}
        onPress={onPress}
      >
        {content}
      </TouchableWithoutFeedback>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
});
