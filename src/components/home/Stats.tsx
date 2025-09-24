"use client";
import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase } from "lucide-react";

export function Stats() {
  const stats = [
    { label: "Active Jobs", value: "2,340+", icon: Briefcase, color: "text-blue-600" },
    { label: "Companies", value: "480+", icon: Users, color: "text-emerald-600" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-purple-600" },
  ];
  
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div 
        className="grid rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 md:p-12 md:grid-cols-3 text-center shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {stats.map((s, i) => {
          const IconComponent = s.icon;
          return (
            <motion.div 
              key={s.label} 
              className={`py-6 ${i !== stats.length - 1 ? "md:border-r border-gray-200" : ""}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-3">
                <div className={`p-3 rounded-2xl bg-gray-50`}>
                  <IconComponent className={`w-6 h-6 ${s.color}`} />
                </div>
              </div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">{s.value}</div>
              <div className="text-sm font-medium text-gray-600">{s.label}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
