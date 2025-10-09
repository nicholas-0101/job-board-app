import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SubscriptionPlan } from "./subscriptionPlans";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelectPlan: (planId: string) => void;
}

// Helper functions (max 15 lines each)
const calculateSavingsPercentage = (original: number, current: number): number => {
  return Math.round(((original - current) / original) * 100);
};

const getCardBorderClass = (isPopular: boolean): string => {
  return isPopular ? "border-[#467EC7] scale-105" : "border-gray-200";
};

const PopularBadge = () => (
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
    <div className="bg-[#467EC7] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
      <Sparkles className="w-4 h-4" />
      Most Popular
    </div>
  </div>
);

const PlanIcon = ({ icon: IconComponent, backgroundColor }: { icon: any; backgroundColor: string }) => (
  <div 
    className="inline-flex p-4 rounded-2xl mb-4"
    style={{ backgroundColor }}
  >
    <IconComponent className="w-8 h-8 text-white" />
  </div>
);

const PriceDisplay = ({ plan }: { plan: SubscriptionPlan }) => (
  <div className="flex items-center justify-center gap-2 mb-2">
    <span className="text-3xl font-bold text-gray-900">
      IDR {plan.price.toLocaleString()}
    </span>
    <span className="text-gray-600">/{plan.period}</span>
  </div>
);

const SavingsDisplay = ({ plan }: { plan: SubscriptionPlan }) => {
  if (plan.originalPrice <= plan.price) return null;
  
  return (
    <div className="text-sm text-gray-600">
      <span className="line-through">IDR {plan.originalPrice.toLocaleString()}</span>
      <span className="ml-2 text-green-600 font-semibold">
        Save {calculateSavingsPercentage(plan.originalPrice, plan.price)}%
      </span>
    </div>
  );
};

const FeatureList = ({ features }: { features: string[] }) => (
  <div className="space-y-4 mb-8 flex-grow">
    {features.map((feature, index) => (
      <div key={index} className="flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 bg-[#24CFA7]/10 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-[#24CFA7]" />
        </div>
        <span className="text-gray-700">{feature}</span>
      </div>
    ))}
  </div>
);

const SelectButton = ({ planName, onSelect }: { planName: string; onSelect: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className="w-full py-3.5 px-6 rounded-xl font-semibold transition-all bg-[#24CFA7] hover:bg-[#24CFA7]/80 text-white border-0"
  >
    Choose {planName}
  </motion.button>
);

export default function PlanCard({ plan, onSelectPlan }: PlanCardProps) {
  const handleSelect = () => onSelectPlan(plan.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative bg-white border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col ${getCardBorderClass(plan.popular)}`}
    >
      {plan.popular && <PopularBadge />}

      <div className="text-center mb-8">
        <PlanIcon icon={plan.icon} backgroundColor={plan.backgroundColor} />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <PriceDisplay plan={plan} />
        <SavingsDisplay plan={plan} />
      </div>

      <FeatureList features={plan.features} />
      <SelectButton planName={plan.name} onSelect={handleSelect} />
    </motion.div>
  );
}