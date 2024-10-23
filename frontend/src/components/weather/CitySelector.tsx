import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

interface Props {
  cities: Array<{ name: string; id: number }>;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const CitySelector: React.FC<Props> = ({ cities, selectedCity, onCityChange }) => {
  return (
    <div className="w-[200px]">
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};