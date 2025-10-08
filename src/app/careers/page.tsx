"use client";

import { motion } from "framer-motion";
import { Laptop, HeartHandshake, Rocket, Coffee } from "lucide-react";

export default function CareersPage() {
  const openRoles = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote - Indonesia",
      type: "Full-time",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Hybrid - Jakarta",
      type: "Full-time",
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote - Southeast Asia",
      type: "Full-time",
    },
    {
      title: "Marketing Specialist",
      department: "Growth",
      location: "Remote",
      type: "Contract",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Build the Future of <span className="text-[#467EC7]">Work</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Join a team of innovators and creators reshaping how professionals
            connect with opportunities. Together, we’re building something
            meaningful — and we want you to be part of it.
          </motion.p>
        </div>
      </section>

      {/* Why Workoo Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#467EC7]">
            Why Work at Workoo?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We're not just a job board — we're a movement to make work more
            human, inclusive, and fulfilling. At Workoo, every idea matters, and
            every team member has the power to create impact.
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li>🌍 Remote-first culture with flexible schedules</li>
            <li>💡 Opportunity to shape the product from the ground up</li>
            <li>🚀 Career growth in a fast-paced environment</li>
            <li>🤝 Supportive and inclusive community</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 gap-6"
        >
          {[
            {
              icon: <Rocket className="w-10 h-10 text-[#24CFA7]" />,
              title: "Innovation",
            },
            {
              icon: <HeartHandshake className="w-10 h-10 text-[#467EC7]" />,
              title: "Collaboration",
            },
            {
              icon: <Laptop className="w-10 h-10 text-[#24CFA7]" />,
              title: "Flexibility",
            },
            {
              icon: <Coffee className="w-10 h-10 text-[#467EC7]" />,
              title: "Balance",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center gap-2">
                {item.icon}
                <h3 className="font-medium text-foreground">{item.title}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Open Roles Section */}
      <section className="bg-card border-t border-border py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-10 text-[#467EC7]"
          >
            Open Positions
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {openRoles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border border-border rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {role.department} • {role.location}
                </p>
                <span className="inline-block text-xs font-medium bg-[#467EC7]/10 text-[#467EC7] px-3 py-1 rounded-full mb-4">
                  {role.type}
                </span>
                <button className="w-full px-4 py-2 bg-[#24CFA7] text-white font-medium rounded-xl hover:bg-[#24CFA7]/80 transition">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-[#467EC7] mb-4"
        >
          Don't See a Role That Fits?
        </motion.h2>
        <p className="text-muted-foreground mb-6">
          We're always looking for talented people. Send us your resume and
          we'll get in touch.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-[#24CFA7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Send Your Resume
        </motion.button>
      </section>
    </div>
  );
}