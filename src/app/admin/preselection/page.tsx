"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TestTube, Plus, Eye, Edit, Trash2, Users, CheckCircle, XCircle,
  Clock, Target, BarChart3, Settings
} from "lucide-react";
import { GlowCard } from "../../../components/ui/GlowCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for pre-selection tests
const mockTests = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    jobId: 1,
    totalQuestions: 25,
    passingScore: 20,
    isActive: true,
    totalAttempts: 45,
    passRate: 78,
    createdAt: "2024-01-15",
    lastModified: "2024-01-20"
  },
  {
    id: 2,
    jobTitle: "UI/UX Designer",
    jobId: 2,
    totalQuestions: 25,
    passingScore: 18,
    isActive: true,
    totalAttempts: 32,
    passRate: 65,
    createdAt: "2024-01-18",
    lastModified: "2024-01-22"
  },
  {
    id: 3,
    jobTitle: "Backend Developer",
    jobId: 3,
    totalQuestions: 25,
    passingScore: 22,
    isActive: false,
    totalAttempts: 28,
    passRate: 82,
    createdAt: "2024-01-20",
    lastModified: "2024-01-25"
  }
];

export default function PreselectionPage() {
  const [tests, setTests] = useState(mockTests);
  const [selectedTest, setSelectedTest] = useState(null);

  const stats = [
    { label: "Total Tests", value: tests.length, icon: TestTube, color: "from-blue-500 to-blue-600" },
    { label: "Active Tests", value: tests.filter(t => t.isActive).length, icon: CheckCircle, color: "from-green-500 to-green-600" },
    { label: "Total Attempts", value: tests.reduce((sum, t) => sum + t.totalAttempts, 0), icon: Users, color: "from-purple-500 to-purple-600" },
    { label: "Avg Pass Rate", value: Math.round(tests.reduce((sum, t) => sum + t.passRate, 0) / tests.length), icon: BarChart3, color: "from-orange-500 to-orange-600", suffix: "%" }
  ];

  const toggleTestStatus = (testId: number) => {
    setTests(tests.map(test => 
      test.id === testId ? { ...test, isActive: !test.isActive } : test
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Pre-Selection Tests</h1>
              <p className="text-sm text-muted-foreground mt-1">Create and manage pre-selection tests for job applicants</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Link href="/admin/jobs">
                <Button variant="outline" className="gap-2">
                  <Settings className="w-5 h-5" />
                  Manage Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-1">
                      {stat.value}{stat.suffix || ""}
                    </h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* How to Create Tests */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">How to Create Pre-Selection Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Go to Job Management</h4>
                    <p className="text-sm text-muted-foreground">Navigate to the job you want to create a test for</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Edit Job Posting</h4>
                    <p className="text-sm text-muted-foreground">Click edit on the job posting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Create Test</h4>
                    <p className="text-sm text-muted-foreground">Add 25 multiple choice questions and set passing score</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/admin/jobs">
                  <Button className="gap-2">
                    <Plus className="w-5 h-5" />
                    Go to Job Management
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tests List */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4">Existing Tests</h3>
          <div className="grid gap-4">
            {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold">{test.jobTitle}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {test.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <TestTube className="w-4 h-4" />
                            <span>{test.totalQuestions} Questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span>Passing: {test.passingScore}/{test.totalQuestions}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{test.totalAttempts} Attempts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            <span>{test.passRate}% Pass Rate</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/jobs/${test.jobId}/edit`}>
                          <Button variant="ghost" className="p-2 text-blue-600 hover:bg-blue-50">
                            <Edit className="w-5 h-5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => toggleTestStatus(test.id)}
                          className={`${test.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        >
                          {test.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4">Pre-Selection Test Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-base font-semibold mb-3">Test Creation</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Create 25 multiple choice questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Set custom passing score</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Job-specific questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Enable/disable tests</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="text-base font-semibold mb-3">Application Control</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Auto-block applications without test</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Block failed test attempts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>View test results in applicant list</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Track pass/fail rates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
