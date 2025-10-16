import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, Clock, Calendar } from "lucide-react";
import { ApplicantDTO } from "@/lib/applicants";

interface ApplicantStatsProps {
  data: { total: number; items: ApplicantDTO[] };
}

export default function ApplicantStats({ data }: ApplicantStatsProps) {
  const stats = [
    {
      label: "Total Applicants",
      value: data.total,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Priority Applications",
      value: data.items.filter((a) => a.isPriority).length,
      icon: Star,
      color: "from-amber-500 to-yellow-600",
    },
    {
      label: "Submitted",
      value: data.items.filter((a) => a.status === "SUBMITTED").length,
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "In Interview",
      value: data.items.filter((a) => a.status === "INTERVIEW").length,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Accepted",
      value: data.items.filter((a) => a.status === "ACCEPTED").length,
      icon: Users,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
