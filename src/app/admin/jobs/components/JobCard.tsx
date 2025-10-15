"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobItemDTO } from "@/lib/jobs";

interface JobCardProps {
  job: JobItemDTO;
  onTogglePublish: (jobId: number, isPublished: boolean) => void;
  onDelete: (jobId: number) => void;
}

export default function JobCard({ job, onTogglePublish, onDelete }: JobCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTogglePublish = async () => {
    setIsUpdating(true);
    try {
      await onTogglePublish(job.id, !job.isPublished);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job?")) {
      onDelete(job.id);
    }
  };

  const getStatusColor = (isPublished: boolean | undefined) => {
    return isPublished
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getStatusIcon = (isPublished: boolean | undefined) => {
    return isPublished ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-500" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(job.isPublished)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.isPublished)}`}>
                  {job.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/jobs/${job.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePublish}
                disabled={isUpdating}
                className={job.isPublished ? "text-yellow-600" : "text-green-600"}
              >
                {job.isPublished ? "Unpublish" : "Publish"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{job.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{job.applicantsCount} applicants</span>
            </div>
            {job.deadline && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <div className="pt-2">
              <Link href={`/admin/jobs/${job.id}/applicants`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-1" />
                  View Applicants
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
