"use client";

import InputField from "./components/inputField";
import {
  FaLinkedinIn,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

export default function SocialMediaSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        Social Media (Optional)
      </h3>

      <InputField
        name="socials.facebook"
        label="Facebook"
        placeholder="https://facebook.com/company-name"
        icon={FaFacebook}
      />

      <InputField
        name="socials.twitter"
        label="Twitter/X"
        placeholder="https://twitter.com/company-name"
        icon={FaTwitter}
      />

      <InputField
        name="socials.linkedin"
        label="LinkedIn"
        placeholder="https://linkedin.com/company/company-name"
        icon={FaLinkedinIn}
      />

      <InputField
        name="socials.instagram"
        label="Instagram"
        placeholder="https://instagram.com/company-name"
        icon={FaInstagram}
      />
    </div>
  );
}
