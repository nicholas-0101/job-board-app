"use client";
import { motion } from "framer-motion";
import { Code, Palette, TrendingUp, BarChart3, DollarSign, Users } from "lucide-react";

export function Categories() {
  const items = [
    { name: "Software Engineer", color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100", icon: Code },
    { name: "Product", color: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100", icon: TrendingUp },
    { name: "Design", color: "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100", icon: Palette },
    { name: "Marketing", color: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100", icon: Users },
    { name: "Data", color: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100", icon: BarChart3 },
    { name: "Finance", color: "bg-cyan-50 text-cyan-700 border-cyan-100 hover:bg-cyan-100", icon: DollarSign },
  ];
  
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Popular Categories</h2>
          <a href="/explore/jobs" className="text-blue-600 hover:text-blue-700 font-medium">View all →</a>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {items.map((c, i) => {
            const IconComponent = c.icon;
            return (
              <motion.button 
                key={c.name} 
                className={`group rounded-2xl border ${c.color} px-6 py-4 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <IconComponent className="w-5 h-5 mx-auto mb-2" />
                {c.name}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
