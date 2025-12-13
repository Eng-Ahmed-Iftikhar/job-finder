import React, { createContext, useState, useCallback, ReactNode } from "react";

export interface SearchContextType {
  searchQuery: string;
  location: string;
  setSearchQuery: (query: string) => void;
  setLocation: (location: string) => void;
  clearSearch: () => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Austin, TX");

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setLocation("Austin, TX");
  }, []);

  const value: SearchContextType = {
    searchQuery,
    location,
    setSearchQuery,
    setLocation,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
