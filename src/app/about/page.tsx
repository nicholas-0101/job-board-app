"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Target, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-[#467EC7] mb-4"
          >
            About <span className="text-[#24CFA7]">Workoo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Workoo connects ambitious professionals with the right
            opportunities — helping people build careers that truly matter.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-4 text-[#467EC7]">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe work should be more than a paycheck — it should be
              meaningful, human, and empowering. That's why Workoo was created:
              to simplify job discovery, promote transparency, and give
              companies and candidates the tools to connect authentically.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Whether you're a company seeking top talent or a candidate
              pursuing growth, Workoo ensures your journey is seamless,
              transparent, and rewarding.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="bg-[#467EC7]/5 p-10 rounded-2xl shadow-md border border-border">
              <Rocket className="w-16 h-16 text-[#24CFA7] mx-auto mb-4" />
              <h3 className="text-xl font-medium text-center text-foreground">
                Empowering Careers
              </h3>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-card border-t border-border py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-10 text-[#467EC7]"
          >
            Our Impact So Far
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-10 h-10 text-[#467EC7]" />,
                title: "50,000+",
                subtitle: "Active Users",
              },
              {
                icon: <Briefcase className="w-10 h-10 text-[#24CFA7]" />,
                title: "10,000+",
                subtitle: "Jobs Posted",
              },
              {
                icon: <Target className="w-10 h-10 text-[#467EC7]" />,
                title: "96%",
                subtitle: "Match Accuracy",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col items-center gap-2">
                  {stat.icon}
                  <h3 className="text-2xl font-semibold text-foreground">
                    {stat.title}
                  </h3>
                  <p className="text-muted-foreground">{stat.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#467EC7]">
            Meet the Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            A passionate group of developers, designers, and thinkers committed
            to redefining how people find work.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {["Nicholas", "Said", "Dhiki"].map(
            (member, i) => (
              <motion.div
                key={member}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-3 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-[#467EC7]/20 flex items-center justify-center font-bold text-lg text-[#467EC7]">
                  {member[0]}
                </div>
                <h4 className="font-medium text-foreground">{member}</h4>
                <p className="text-muted-foreground text-sm">
                  Fullstack Developer
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  );
}