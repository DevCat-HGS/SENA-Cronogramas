import { useState } from 'react';
import { Popover } from '@headlessui/react';
import Button from './Button';

export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'date' | 'text';
  options?: { value: string; label: string }[];
}

export interface AdvancedFiltersProps {
  filters: FilterOption[];
  onFilterChange: (name: string, value: unknown) => void;
  options?: Record<string, unknown>;
}

export function AdvancedFilters({ filters, onFilterChange }: AdvancedFiltersProps) {
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});

  const handleFilterChange = (filterId: string, value: unknown) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(JSON.stringify(filterValues), filterValues);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    onFilterChange(JSON.stringify({}), {});
  };

  return (
    <Popover className="relative">
      <Popover.Button as={Button} variant="outline">
        Filtros Avanzados
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-2 w-96 rounded-md bg-white p-4 shadow-lg">
        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.id}>
              <label className="block text-sm font-medium text-gray-700">
                {filter.label}
              </label>
              {filter.type === 'select' && (
                <select
                  className="mt-1 block w-full rounded-md border-gray-300"
                  value={(filterValues[filter.id] as string) || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                >
                  <option value="">Todos</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {filter.type === 'text' && (
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  value={(filterValues[filter.id] as string) || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                />
              )}
              {filter.type === 'date' && (
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  value={(filterValues[filter.id] as string) || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={handleResetFilters}>
              Resetear
            </Button>
            <Button onClick={handleApplyFilters}>Aplicar</Button>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
} 