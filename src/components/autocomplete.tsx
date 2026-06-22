"use client";

import { useState, useEffect, useRef } from "react";
import { formatCurrency } from "@/lib/utils";

type AutocompleteProps<T> = {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (item: T) => void;
  fetchData: (term: string) => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  getInputValue: (item: T) => string;
  placeholder?: string;
  required?: boolean;
};

export function Autocomplete<T>({
  value,
  onChange,
  onSelect,
  fetchData,
  renderItem,
  getInputValue,
  placeholder,
  required,
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (value.trim().length > 0 && isOpen) {
        setIsLoading(true);
        const results = await fetchData(value);
        setOptions(results);
        setIsLoading(false);
      } else {
        setOptions([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [value, isOpen, fetchData]);

  const handleSelect = (item: T) => {
    const val = getInputValue(item);
    onChange(val);
    setIsOpen(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (value.trim().length > 0) setIsOpen(true);
        }}
        className="w-full h-12 px-4 rounded-xl border border-primary-200 bg-surface-base text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
      />
      
      {isOpen && (value.trim().length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-surface-base border border-primary-200 rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-primary-500 text-sm">Đang tìm...</div>
          ) : options.length > 0 ? (
            <ul className="max-h-60 overflow-auto divide-y divide-primary-100">
              {options.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-3 hover:bg-primary-50 active:bg-primary-100 cursor-pointer transition-colors min-h-[48px] flex items-center"
                >
                  {renderItem(item)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-primary-500 text-sm">Không tìm thấy gợi ý nào</div>
          )}
        </div>
      )}
    </div>
  );
}
