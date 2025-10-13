"use client";

import { Field, ErrorMessage } from "formik";
import { formatRupiah } from "@/lib/utils/currencyUtils";

interface SalaryInputFieldProps {
  errors: any;
  touched: any;
}

export default function SalaryInputField({ errors, touched }: SalaryInputFieldProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        Expected Salary
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
          IDR
        </span>

        <Field name="expectedSalary">
          {({ field, form }: any) => {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              form.setFieldValue(field.name, rawValue);
            };

            return (
              <input
                {...field}
                type="text"
                value={formatRupiah(field.value)}
                onChange={handleChange}
                placeholder="e.g., 10.000.000"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
                  form.errors.expectedSalary && form.touched.expectedSalary
                    ? "border-red-400 bg-red-50"
                    : "border-input focus:border-primary bg-secondary"
                }`}
              />
            );
          }}
        </Field>
      </div>
      <ErrorMessage
        name="expectedSalary"
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>
  );
}
