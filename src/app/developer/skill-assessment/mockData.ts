import { SkillAssessment } from "./types";

export const mockAssessments: SkillAssessment[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Frontend Development",
    questions: 25,
    passRate: 75,
    duration: 60,
    status: "active",
    participants: 142,
    passedCount: 89,
    createdAt: "2024-01-15",
    difficulty: "Intermediate"
  },
  {
    id: 2,
    title: "React Advanced Concepts",
    category: "Frontend Development", 
    questions: 25,
    passRate: 75,
    duration: 90,
    status: "active",
    participants: 78,
    passedCount: 52,
    createdAt: "2024-01-20",
    difficulty: "Advanced"
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    category: "Backend Development",
    questions: 25,
    passRate: 75,
    duration: 75,
    status: "draft",
    participants: 0,
    passedCount: 0,
    createdAt: "2024-02-01",
    difficulty: "Intermediate"
  },
  {
    id: 4,
    title: "Database Design & SQL",
    category: "Database",
    questions: 25,
    passRate: 75,
    duration: 90,
    status: "active",
    participants: 95,
    passedCount: 71,
    createdAt: "2024-01-10",
    difficulty: "Advanced"
  },
  {
    id: 5,
    title: "Python Programming Basics",
    category: "Programming",
    questions: 20,
    passRate: 70,
    duration: 45,
    status: "active",
    participants: 156,
    passedCount: 124,
    createdAt: "2024-01-05",
    difficulty: "Beginner"
  }
];
