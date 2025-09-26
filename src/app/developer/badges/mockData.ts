import { Badge, Certificate } from "./types";

export const mockBadges: Badge[] = [
  {
    id: 1,
    name: "JavaScript Expert",
    description: "Mastery in JavaScript fundamentals and advanced concepts",
    icon: "🏆",
    color: "#FFD700",
    category: "Programming",
    requirements: "Pass JavaScript Assessment with 75% score",
    issuedCount: 89,
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "React Developer",
    description: "Proficient in React development and best practices",
    icon: "⚛️",
    color: "#61DAFB",
    category: "Frontend",
    requirements: "Pass React Assessment with 75% score",
    issuedCount: 52,
    status: "active",
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    name: "Node.js Specialist",
    description: "Backend development expertise with Node.js",
    icon: "🟢",
    color: "#339933",
    category: "Backend",
    requirements: "Pass Node.js Assessment with 75% score",
    issuedCount: 0,
    status: "draft",
    createdAt: "2024-02-01"
  },
  {
    id: 4,
    name: "Database Master",
    description: "Advanced database design and SQL expertise",
    icon: "🗄️",
    color: "#FF6B35",
    category: "Database",
    requirements: "Pass Database Assessment with 75% score",
    issuedCount: 71,
    status: "active",
    createdAt: "2024-01-10"
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 1,
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    badgeName: "JavaScript Expert",
    assessmentScore: 85,
    issuedAt: "2024-02-10T14:30:00Z",
    certificateId: "CERT-JS-001",
    qrCode: "QR123456789",
    downloadCount: 3,
    verified: true
  },
  {
    id: 2,
    recipientName: "Jane Smith",
    recipientEmail: "jane@example.com",
    badgeName: "React Developer",
    assessmentScore: 92,
    issuedAt: "2024-02-12T09:15:00Z",
    certificateId: "CERT-REACT-001",
    qrCode: "QR987654321",
    downloadCount: 1,
    verified: true
  },
  {
    id: 3,
    recipientName: "Mike Johnson",
    recipientEmail: "mike@example.com",
    badgeName: "Database Master",
    assessmentScore: 78,
    issuedAt: "2024-02-14T16:45:00Z",
    certificateId: "CERT-DB-001",
    qrCode: "QR456789123",
    downloadCount: 0,
    verified: false
  }
];
