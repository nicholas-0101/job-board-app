import { useFormikContext } from "formik";
import { FileText } from "lucide-react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface QuillFieldProps {
  name: string;
  label: string;
  icon?: React.ElementType;
  placeholder?: string;
}

export default function QuillField({
  name,
  label,
  icon: Icon = FileText,
  placeholder,
}: QuillFieldProps) {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<any>();

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground mb-2"
      >
        {label}
      </label>

      <div
        className={`relative rounded-xl border-2 transition-all ${
          touched[name] && errors[name]
            ? "border-red-400 bg-red-50"
            : "border-input bg-secondary focus-within:border-primary hover:bg-background"
        }`}
      >
        {Icon && (
          <Icon className="absolute left-4 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        )}

        <ReactQuill
          id={name}
          value={values[name]}
          onChange={(val) => setFieldValue(name, val)}
          onBlur={() => setFieldTouched(name, true)}
          className="custom-quill w-full pl-12 pr-4"
          placeholder={placeholder}
        />
      </div>

      {touched[name] && errors[name] && (
        <div className="text-red-400 text-sm mt-1">
          {errors[name] as string}
        </div>
      )}
    </div>
  );
}
