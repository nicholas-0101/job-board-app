import { ErrorMessage, useField } from "formik";
import { Calendar } from "lucide-react";

interface InputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<any>;
}

export default function InputField ({
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  toggleIcon,
  onToggle,
}: InputFieldProps & {
  toggleIcon?: React.ReactNode;
  onToggle?: () => void;
}) {
  const [field, meta] = useField(name);

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground mb-2"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          id={name}
          {...field}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
            meta.touched && meta.error
              ? "border-red-400 bg-red-50"
              : "border-input focus:border-primary bg-secondary"
          }`}
        />

        {toggleIcon ? (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {toggleIcon}
          </button>
        ) : type === "date" ? (
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById(
                name
              ) as HTMLInputElement | null;
              if (input) {
                (input as any).showPicker?.();
              }
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Calendar className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>
  );
};
