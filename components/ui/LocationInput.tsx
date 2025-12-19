import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  Text,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LocationSuggestion = {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

interface LocationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onLocationSelect?: (location: LocationSuggestion) => void;
  placeholder?: string;
  showCurrentLocation?: boolean;
  onUseCurrentLocation?: () => void;
}

// Mock location suggestions - replace with actual Google Places API
const getLocationSuggestions = (query: string): LocationSuggestion[] => {
  if (!query || query.length < 2) return [];

  const mockLocations = [
    {
      id: "1",
      description: "78001 Artesia Wells, TX",
      mainText: "78001 Artesia Wells",
      secondaryText: "TX",
    },
    {
      id: "2",
      description: "78002 Atascosa, TX",
      mainText: "78002 Atascosa",
      secondaryText: "TX",
    },
    {
      id: "3",
      description: "78003 Bandera, TX",
      mainText: "78003 Bandera",
      secondaryText: "TX",
    },
  ];

  return mockLocations.filter((loc) =>
    loc.description.toLowerCase().includes(query.toLowerCase())
  );
};

export default function LocationInput({
  value,
  onChangeText,
  onLocationSelect,
  placeholder = "Type address or ZIP",
  showCurrentLocation = true,
  onUseCurrentLocation,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleTextChange = (text: string) => {
    onChangeText(text);
    const results = getLocationSuggestions(text);
    setSuggestions(results);
  };

  const handleSelectLocation = (location: LocationSuggestion) => {
    onChangeText(location.mainText);
    setSuggestions([]);
    Keyboard.dismiss();
    onLocationSelect?.(location);
  };

  const handleUseCurrentLocation = () => {
    onUseCurrentLocation?.();
    setSuggestions([]);
  };

  const showSuggestions =
    isFocused && (suggestions.length > 0 || (showCurrentLocation && !value));

  return (
    <View className="relative">
      <View className="flex-row items-center bg-white rounded-lg border border-gray-200 px-3 h-12">
        <Ionicons
          name="location-outline"
          size={20}
          color="#9CA3AF"
          style={{ marginRight: 8 }}
        />
        <TextInput
          ref={inputRef}
          className="flex-1 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {value.length > 0 && (
          <Pressable onPress={() => handleTextChange("")} className="p-1">
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>

      {showSuggestions && (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50">
          {showCurrentLocation && !value && (
            <Pressable
              onPress={handleUseCurrentLocation}
              className="flex-row items-center px-4 py-3 border-b border-gray-100"
            >
              <Ionicons
                name="navigate"
                size={18}
                color="#10b981"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base font-semibold text-emerald-600">
                Use my current location
              </Text>
            </Pressable>
          )}

          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectLocation(item)}
                  className="flex-row items-start px-4 py-3 border-b border-gray-100"
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color="#6B7280"
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <Text className="text-base text-gray-900">
                      {item.mainText}
                    </Text>
                    {item.secondaryText && (
                      <Text className="text-sm font-medium text-gray-500">
                        {item.secondaryText}
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
              scrollEnabled={false}
              nestedScrollEnabled
            />
          )}
        </View>
      )}
    </View>
  );
}
