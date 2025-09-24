"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Plus, Filter, ThumbsUp, ThumbsDown, 
  DollarSign, Users, TrendingUp, Award,
  Building2, MapPin, Calendar, Eye, EyeOff,
  Shield, CheckCircle, AlertCircle
} from "lucide-react";

const companyReviews = [
  {
    id: 1,
    position: "Software Engineer",
    department: "Engineering",
    employmentType: "Full-time",
    workDuration: "2 years",
    overallRating: 4.5,
    ratings: {
      workLifeBalance: 4,
      salary: 4,
      culture: 5,
      management: 4,
      careerGrowth: 4,
      benefits: 4
    },
    salaryRange: {
      min: 15000000,
      max: 25000000,
      currency: "IDR"
    },
    pros: "Great work-life balance, supportive team, modern tech stack, flexible working hours, good learning opportunities.",
    cons: "Limited career advancement, salary could be better for senior roles, sometimes unclear requirements.",
    advice: "Great place to start your career in tech. Focus on learning and building relationships with senior developers.",
    wouldRecommend: true,
    helpful: 23,
    notHelpful: 2,
    datePosted: "2024-01-15",
    verified: true
  },
  {
    id: 2,
    position: "Product Manager",
    department: "Product",
    employmentType: "Full-time",
    workDuration: "1.5 years",
    overallRating: 3.8,
    ratings: {
      workLifeBalance: 3,
      salary: 4,
      culture: 4,
      management: 3,
      careerGrowth: 4,
      benefits: 4
    },
    salaryRange: {
      min: 20000000,
      max: 35000000,
      currency: "IDR"
    },
    pros: "Good salary, interesting projects, smart colleagues, opportunity to work with latest technologies.",
    cons: "High pressure environment, long working hours during product launches, limited work-life balance.",
    advice: "Be prepared for fast-paced environment. Great if you want to grow quickly but can be stressful.",
    wouldRecommend: true,
    helpful: 18,
    notHelpful: 5,
    datePosted: "2024-01-10",
    verified: true
  }
];

const ratingCategories = [
  { key: "workLifeBalance", label: "Work-Life Balance", icon: "⚖️" },
  { key: "salary", label: "Salary & Benefits", icon: "💰" },
  { key: "culture", label: "Company Culture", icon: "🏢" },
  { key: "management", label: "Management", icon: "👥" },
  { key: "careerGrowth", label: "Career Growth", icon: "📈" },
  { key: "benefits", label: "Benefits", icon: "🎁" }
];

export default function CompanyReviewsPage({ params }: { params: { id: string } }) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [newReview, setNewReview] = useState({
    position: "",
    department: "",
    employmentType: "Full-time",
    workDuration: "",
    overallRating: 0,
    ratings: {
      workLifeBalance: 0,
      salary: 0,
      culture: 0,
      management: 0,
      careerGrowth: 0,
      benefits: 0
    },
    salaryRange: { min: 0, max: 0 },
    pros: "",
    cons: "",
    advice: "",
    wouldRecommend: true
  });

  const averageRatings = {
    overall: 4.2,
    workLifeBalance: 3.5,
    salary: 4.0,
    culture: 4.5,
    management: 3.5,
    careerGrowth: 4.0,
    benefits: 4.0
  };

  const StarRating = ({ rating, size = "w-4 h-4", interactive = false, onChange }: any) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <Star
              className={`${size} ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Company Reviews</h1>
              <p className="text-muted-foreground mt-1">Anonymous reviews from verified employees</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddReview(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Write Review
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Company Overview */}
        <div className="bg-background rounded-3xl border border-border p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-foreground mb-2">{averageRatings.overall}</div>
              <StarRating rating={averageRatings.overall} size="w-6 h-6" />
              <p className="text-muted-foreground mt-2">Based on {companyReviews.length} reviews</p>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>5 stars</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "60%" }} />
                  </div>
                  <span>60%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>4 stars</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "30%" }} />
                  </div>
                  <span>30%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>3 stars</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "10%" }} />
                  </div>
                  <span>10%</span>
                </div>
              </div>
            </div>

            {/* Category Ratings */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-4">Rating Breakdown</h3>
              {ratingCategories.map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-foreground/80">{category.label}</span>
                  </div>
                  <StarRating rating={averageRatings[category.key as keyof typeof averageRatings]} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Salary Insights */}
        <div className="bg-background rounded-3xl border border-border p-8 mb-8">
          <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Salary Insights
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="text-2xl font-bold text-green-700">IDR 15-35M</div>
              <div className="text-sm text-green-600 mt-1">Average Range</div>
              <div className="text-xs text-gray-500 mt-2">Based on 2 salary reports</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="text-2xl font-bold text-blue-700">IDR 20M</div>
              <div className="text-sm text-blue-600 mt-1">Entry Level</div>
              <div className="text-xs text-gray-500 mt-2">0-2 years experience</div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="text-2xl font-bold text-purple-700">IDR 30M</div>
              <div className="text-sm text-purple-600 mt-1">Senior Level</div>
              <div className="text-xs text-gray-500 mt-2">3+ years experience</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
            className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={2}>2+ Stars</option>
            <option value={1}>1+ Stars</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {companyReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl border border-border p-6 hover:shadow-lg transition-all"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{review.position}</h3>
                    {review.verified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{review.department}</span>
                    <span>•</span>
                    <span>{review.employmentType}</span>
                    <span>•</span>
                    <span>{review.workDuration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={review.overallRating} />
                  <p className="text-xs text-muted-foreground mt-1">{review.datePosted}</p>
                </div>
              </div>

              {/* Salary Info */}
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Salary Range</span>
                </div>
                <p className="text-green-700">
                  IDR {(review.salaryRange.min / 1000000).toFixed(0)}M - {(review.salaryRange.max / 1000000).toFixed(0)}M per month
                </p>
              </div>

              {/* Category Ratings */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {ratingCategories.slice(0, 3).map((category) => (
                  <div key={category.key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{category.label}</span>
                    <StarRating rating={review.ratings[category.key as keyof typeof review.ratings]} />
                  </div>
                ))}
              </div>

              {/* Review Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    Pros
                  </h4>
                  <p className="text-foreground/80 text-sm">{review.pros}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    Cons
                  </h4>
                  <p className="text-foreground/80 text-sm">{review.cons}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    Advice to Management
                  </h4>
                  <p className="text-foreground/80 text-sm">{review.advice}</p>
                </div>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.wouldRecommend 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {review.wouldRecommend ? "✓ Recommends" : "✗ Doesn't Recommend"}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    Not Helpful ({review.notHelpful})
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddReview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Write Anonymous Review</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  Anonymous & Secure
                </div>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Position *</label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                    <select className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground">
                      <option>Engineering</option>
                      <option>Product</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>HR</option>
                      <option>Finance</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Salary Range (IDR per month)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Minimum"
                      className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Maximum"
                      className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                    />
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">Rate Your Experience</label>
                  <div className="space-y-4">
                    {ratingCategories.map((category) => (
                      <div key={category.key} className="flex items-center justify-between">
                        <span className="text-foreground/80">{category.label}</span>
                        <StarRating 
                          rating={newReview.ratings[category.key as keyof typeof newReview.ratings]} 
                          interactive={true}
                          onChange={(rating: number) => {
                            setNewReview(prev => ({
                              ...prev,
                              ratings: { ...prev.ratings, [category.key]: rating }
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">What are the pros? *</label>
                    <textarea
                      rows={3}
                      placeholder="What did you like about working here?"
                      className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">What are the cons? *</label>
                    <textarea
                      rows={3}
                      placeholder="What could be improved?"
                      className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Advice to Management</label>
                    <textarea
                      rows={2}
                      placeholder="What advice would you give to management?"
                      className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddReview(false)}
                    className="flex-1 px-6 py-3 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Submit Review
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
