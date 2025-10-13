import { ErrorMessage, useField } from "formik";
import { User } from "lucide-react";

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export default function SelectField({
  name,
  label,
  options,
}: SelectFieldProps) {
  const [field, meta] = useField(name);

  return (
    <div className="mb-6 relative">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>

        <select
          id={name}
          {...field}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 focus:outline-none transition-all appearance-none ${
            meta.touched && meta.error
              ? "border-red-400 bg-red-50"
              : "border-input focus:border-primary bg-secondary hover:bg-background"
          }`}
        >
          <option value="">Select gender</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>
  );
}
