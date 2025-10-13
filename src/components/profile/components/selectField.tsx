"use client";
import { useState, useRef, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import { User } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
}

export default function SelectField({ 
  name,
  label,
  options,
  placeholder = "Select an option...",
}: SelectFieldProps) {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtered options for search (optional)
  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  // Click outside handler
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
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>

        <button
          type="button"
          onClick={() => setShowDropdown((prev) => !prev)}
          className={`w-full pl-10 pr-4 py-3 text-left rounded-xl border-2 focus:outline-none transition-all ${
            meta.touched && meta.error
              ? "border-red-400 bg-red-50"
              : "border-input focus:border-primary bg-secondary hover:bg-background"
          }`}
        >
          {field.value
            ? options.find((opt) => opt.value === field.value)?.label
            : placeholder}
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-background border border-input rounded-xl shadow-md z-10">
            {filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setFieldValue(name, opt.value);
                  setShowDropdown(false);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-2 hover:bg-secondary"
              >
                {opt.label}
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
