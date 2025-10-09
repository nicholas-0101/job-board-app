"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const integrations = [
  {
    name: "Notion",
    description: "Manage hiring workflows, notes, and onboarding",
    logo: "/logos/notion.svg",
  },
  {
    name: "Slack",
    description: "Get notifications on new applications",
    logo: "/logos/slack.svg",
  },
  {
    name: "Google Calendar",
    description: "Sync interviews with your calendar",
    logo: "/logos/googlecalendar.svg",
  },
  {
    name: "Zoom",
    description: "Schedule interviews directly",
    logo: "/logos/zoom.svg",
  },
  {
    name: "Google Sheets",
    description: "Export candidate data to sheets",
    logo: "/logos/googlesheets.svg",
  },
  {
    name: "Greenhouse",
    description: "Sync candidates and job postings directly from your ATS",
    logo: "/logos/greenhouse.svg",
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-6 text-[#467EC7]"
          >
            Workoo <span className="text-[#24CFA7]">Integrations</span>
          </motion.h1>
          <p className="text-xl opacity-90 mb-12 text-muted-foreground">
            Connect Workoo with your favorite tools and streamline your hiring
            workflow.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card
            key={integration.name}
            className="p-6 flex flex-col bg-card items-center text-center hover:shadow-lg transition-shadow"
          >
            <div
              className="w-16 h-16 mb-4 bg-[#467EC7] mask mask-center mask-contain mask-no-repeat"
              style={{
                maskImage: `url(${integration.logo})`,
                WebkitMaskImage: `url(${integration.logo})`,
              }}
            />
            <h3 className="font-bold text-xl text-foreground">
              {integration.name}
            </h3>
            <p className="text-muted-foreground mt-2">
              {integration.description}
            </p>
            <button className="mt-4 px-4 py-2 w-full bg-[#24CFA7] text-white rounded-lg hover:bg-[#24CFA7]/80 transition-colors">
              Connect
            </button>
          </Card>
        ))}
      </section>
    </div>
  );
}
