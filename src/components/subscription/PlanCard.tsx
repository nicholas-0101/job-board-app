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
      className={`relative bg-background border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
        plan.popular ? "border-primary scale-105" : "border-border"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
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
        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl font-bold text-foreground">
            IDR {plan.price.toLocaleString()}
          </span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </div>
        {plan.originalPrice > plan.price && (
          <div className="text-sm text-muted-foreground">
            <span className="line-through">IDR {plan.originalPrice.toLocaleString()}</span>
            <span className="ml-2 text-green-600 font-semibold">
              Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-foreground/80">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectPlan(plan.id)}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${
          plan.popular
            ? "bg-primary text-primary-foreground shadow-sm hover:shadow"
            : "bg-background border border-border text-foreground hover:bg-secondary"
        }`}
      >
        {plan.popular ? "Get Premium Access" : "Choose Standard"}
      </motion.button>
    </motion.div>
  );
}
