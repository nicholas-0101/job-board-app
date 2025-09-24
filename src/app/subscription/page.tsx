"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, Star, Zap, Crown, Shield, Sparkles, 
  CreditCard, Upload, FileText, Award, Target,
  Users, Briefcase, Calendar, TrendingUp
} from "lucide-react";

const subscriptionPlans = [
  {
    name: "Standard",
    price: 25000,
    originalPrice: 35000,
    period: "month",
    popular: false,
    color: "from-blue-500 to-blue-600",
    icon: Briefcase,
    features: [
      "CV Generator access",
      "Skill Assessment (2x per month)",
      "Basic job alerts",
      "Standard support",
      "Profile optimization tips"
    ],
    limitations: [
      "Limited assessment attempts",
      "No priority review"
    ]
  },
  {
    name: "Professional",
    price: 100000,
    originalPrice: 150000,
    period: "month",
    popular: true,
    color: "from-purple-500 to-purple-600",
    icon: Crown,
    features: [
      "Everything in Standard",
      "Unlimited Skill Assessments",
      "Priority CV review",
      "Advanced job matching",
      "Premium support",
      "Interview preparation guide",
      "Salary negotiation tips",
      "Career coaching session (1x)",
      "LinkedIn profile optimization"
    ],
    limitations: []
  }
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Unlock Premium Features</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Supercharge Your Career
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get access to exclusive tools and features that will accelerate your job search and career growth
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {subscriptionPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                  plan.popular 
                    ? "border-purple-200 shadow-2xl scale-105" 
                    : "border-gray-200 hover:border-blue-200 hover:shadow-xl"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.color} mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 line-through">
                        IDR {plan.originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                        SAVE {Math.round((1 - plan.price/plan.originalPrice) * 100)}%
                      </span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      IDR {plan.price.toLocaleString()}
                      <span className="text-lg font-normal text-gray-500">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 rounded-full mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowPayment(true);
                    }}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg"
                    }`}
                  >
                    {plan.popular ? "Get Premium Access" : "Choose Standard"}
                  </motion.button>

                  {plan.popular && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      ⚡ Instant activation • 30-day money back guarantee
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Modal */}
        {showPayment && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Your Purchase
                </h3>
                <p className="text-gray-600">
                  {selectedPlan.name} Plan - IDR {selectedPlan.price.toLocaleString()}/month
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid gap-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        checked={paymentMethod === "transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <Upload className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Bank Transfer</p>
                        <p className="text-sm text-gray-500">Upload payment proof</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="gateway"
                        disabled
                        className="text-blue-600"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Payment Gateway</p>
                        <p className="text-sm text-gray-500">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === "transfer" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Bank Transfer Details:</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Bank:</strong> BCA</p>
                        <p><strong>Account:</strong> 1234567890</p>
                        <p><strong>Name:</strong> ProHire Indonesia</p>
                        <p><strong>Amount:</strong> IDR {selectedPlan.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Proof
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Submit Payment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Features Comparison */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Premium?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-2xl w-fit mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">Get matched with jobs that perfectly fit your skills and preferences</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-2xl w-fit mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skill Certification</h3>
              <p className="text-gray-600">Earn verified certificates to showcase your expertise to employers</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-2xl w-fit mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-gray-600">Access exclusive resources and coaching to accelerate your career</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period."
              },
              {
                q: "What happens if I don't pass the skill assessment?",
                a: "Don't worry! You can retake assessments. Standard users get 2 attempts per month, while Professional users get unlimited attempts."
              },
              {
                q: "How does the CV review work?",
                a: "Professional subscribers get priority CV reviews by our career experts within 24 hours, with detailed feedback and improvement suggestions."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
