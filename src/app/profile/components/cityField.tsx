"use client";
import { useState, useRef, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import { indonesiaCities } from "@/data/indonesiaCities";
import { MapPin } from "lucide-react";

interface CityFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export default function CityField({
  name,
  label,
  placeholder,
}: CityFieldProps) {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredCities = indonesiaCities.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6 relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      <div className="relative">
        {/* Icon on the left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <MapPin className="w-5 h-5" />
        </div>

        <input
          type="text"
          placeholder={placeholder || "Search city..."}
          value={field.value || query} 
          onChange={(e) => {
            setQuery(e.target.value);
            setFieldValue(name, e.target.value); 
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
            meta.touched && meta.error
              ? "border-red-400 bg-red-50"
              : "border-input focus:border-primary bg-secondary"
          }`}
        />

        {showDropdown && filteredCities.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-background border border-input rounded-xl shadow-md z-10">
            {filteredCities.map((city, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(city);
                  setFieldValue(name, city);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-secondary"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {meta.touched && meta.error && (
        <div className="text-red-400 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
}
