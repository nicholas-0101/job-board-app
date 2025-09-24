"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, Award, ArrowRight } from "lucide-react";

const assessments = [
  { id: 1, title: "Frontend Development", duration: "25 min", participants: "1,234", difficulty: "Intermediate" },
  { id: 2, title: "Backend Engineering", duration: "30 min", participants: "987", difficulty: "Advanced" },
  { id: 3, title: "UI/UX Design", duration: "20 min", participants: "756", difficulty: "Beginner" },
];

export default function AssessmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Skill Assessments</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your skills and showcase your expertise to potential employers with our comprehensive assessments.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment, i) => (
            <motion.div
              key={assessment.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  assessment.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  assessment.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {assessment.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{assessment.title}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {assessment.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {assessment.participants} completed
                </div>
              </div>
              
              <Link
                href={`/assessments/${assessment.id}`}
                className="group inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#0D6EFD] text-white font-medium shadow-sm hover:opacity-90 transition"
              >
                Start Assessment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </div>
    </div>
  );
}
