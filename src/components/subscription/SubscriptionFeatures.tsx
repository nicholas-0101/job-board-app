import { FileText, Target, Clock, Award, Users, Zap } from "lucide-react";

interface FeatureItem {
  icon: any;
  title: string;
  description: string;
  available: "standard" | "professional" | "both";
}

const features: FeatureItem[] = [
  {
    icon: FileText,
    title: "CV Generator",
    description:
      "Create professional, ATS-friendly CVs with customizable templates",
    available: "both",
  },
  {
    icon: Target,
    title: "Skill Assessment",
    description: "Test your skills with comprehensive assessments",
    available: "both",
  },
  {
    icon: Clock,
    title: "Priority Review",
    description: "Get faster response when applying for jobs",
    available: "professional",
  },
  {
    icon: Award,
    title: "Premium Templates",
    description: "Access exclusive CV and certificate templates",
    available: "professional",
  },
  {
    icon: Users,
    title: "Priority Support",
    description: "Get dedicated customer support",
    available: "professional",
  },
  {
    icon: Zap,
    title: "Email Reminders",
    description: "Automatic reminders H-1 before subscription expires",
    available: "both",
  },
];

const getFeatureAvailability = (available: string) => {
  switch (available) {
    case "both":
      return { text: "All Plans", color: "#467EC7" };
    case "professional":
      return { text: "Professional Only", color: "#24CFA7" };
    case "standard":
      return { text: "Standard Only", color: "#A3B6CE" };
    default:
      return { text: "Unknown", color: "#gray" };
  }
};

export default function SubscriptionFeatures() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            What's Included
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Comprehensive features to accelerate your career growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const availability = getFeatureAvailability(feature.available);

            return (
              <div
                key={index}
                className="bg-white border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
                style={{ borderColor: "#E1F1F3" }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4"
                  style={{ backgroundColor: availability.color + "20" }}
                >
                  <IconComponent
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ color: availability.color }}
                  />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{feature.description}</p>

                <span
                  className="inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium text-white"
                  style={{ backgroundColor: availability.color }}
                >
                  {availability.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
