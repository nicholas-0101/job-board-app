"use client";

import InputField from "./components/inputField";
import CityField from "./components/cityField";
import { MapPin } from "lucide-react";

export default function LocationInfoSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        Location
      </h3>

      <InputField
        name="address"
        label="Full Address"
        placeholder="Jl. Sudirman No. 123"
        icon={MapPin}
      />

      <CityField
        name="locationCity"
        label="City"
        placeholder="Select city..."
      />
    </div>
  );
}
