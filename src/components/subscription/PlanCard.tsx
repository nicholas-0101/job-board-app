import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SubscriptionPlan } from "./subscriptionPlans";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelectPlan: (planId: string) => void;
}

export default function PlanCard({ plan, onSelectPlan }: PlanCardProps) {
  const IconComponent = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative bg-white border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col ${
        plan.popular ? "border-[#467EC7] scale-105" : "border-gray-200"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-[#467EC7] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.color} mb-4`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            IDR {plan.price.toLocaleString()}
          </span>
          <span className="text-gray-600">/{plan.period}</span>
        </div>
        {plan.originalPrice > plan.price && (
          <div className="text-sm text-gray-600">
            <span className="line-through">IDR {plan.originalPrice.toLocaleString()}</span>
            <span className="ml-2 text-green-600 font-semibold">
              Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-[#467EC7]/10 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-[#467EC7]" />
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectPlan(plan.id)}
        className="w-full py-3.5 px-6 rounded-xl font-semibold transition-all bg-[#24CFA7] hover:bg-[#24CFA7]/80 text-white border-0"
      >
        Choose {plan.name}
      </motion.button>
    </motion.div>
  );
}
