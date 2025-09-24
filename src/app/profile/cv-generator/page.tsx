"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Eye, Save, Plus, Trash2, Edit3, 
  FileText, User, Briefcase, GraduationCap, 
  Award, Languages, Phone, Mail, MapPin,
  Calendar, Star, Sparkles, Crown
} from "lucide-react";

const cvTemplates = [
  {
    id: "ats-modern",
    name: "ATS Modern",
    description: "Clean, ATS-friendly design perfect for tech roles",
    preview: "🎯",
    isPremium: false,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "creative-pro",
    name: "Creative Pro",
    description: "Eye-catching design for creative professionals",
    preview: "🎨",
    isPremium: true,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional template for senior positions",
    preview: "👔",
    isPremium: true,
    color: "from-gray-700 to-gray-900"
  }
];

export default function CVGeneratorPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("ats-modern");
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: []
  });

  const steps = [
    { id: 1, title: "Template", icon: FileText },
    { id: 2, title: "Personal Info", icon: User },
    { id: 3, title: "Experience", icon: Briefcase },
    { id: 4, title: "Education", icon: GraduationCap },
    { id: 5, title: "Skills", icon: Award },
    { id: 6, title: "Preview", icon: Eye }
  ];

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      }]
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: ""
      }]
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
              <p className="text-gray-600">Select a template that matches your industry and style</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {cvTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {template.isPremium && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        PRO
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-2xl`}>
                      {template.preview}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="+62 812 3456 7890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={cvData.personalInfo.location}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Jakarta, Indonesia"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                <textarea
                  value={cvData.personalInfo.summary}
                  onChange={(e) => setCvData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, summary: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Brief summary of your professional background and career objectives..."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Work Experience</h2>
                <p className="text-gray-600">Add your professional experience</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addExperience}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </motion.button>
            </div>
            
            <div className="space-y-6">
              {cvData.experience.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No experience added yet. Click "Add Experience" to get started.</p>
                </div>
              ) : (
                cvData.experience.map((exp, index) => (
                  <div key={exp.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                        <input
                          type="text"
                          placeholder="Software Engineer"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                        <input
                          type="text"
                          placeholder="Tech Company"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          type="month"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          type="month"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows={3}
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Preview & Download</h2>
              <p className="text-gray-600">Review your CV and download when ready</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* CV Preview */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{cvData.personalInfo.fullName || "Your Name"}</h3>
                  <p className="text-gray-600">{cvData.personalInfo.email || "your.email@example.com"}</p>
                  <p className="text-gray-500">{cvData.personalInfo.phone || "+62 XXX XXX XXXX"}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Professional Summary</h4>
                    <p className="text-gray-700 text-sm">
                      {cvData.personalInfo.summary || "Your professional summary will appear here..."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Experience</h4>
                    {cvData.experience.length === 0 ? (
                      <p className="text-gray-500 text-sm">No experience added yet</p>
                    ) : (
                      <div className="space-y-3">
                        {cvData.experience.map((exp, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium text-gray-900">Job Title</p>
                            <p className="text-gray-600">Company Name</p>
                            <p className="text-gray-500">Date Range</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Download Options */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Ready to Download</h3>
                  </div>
                  <p className="text-gray-600 mb-6">Your CV is ready! Choose your preferred format below.</p>
                  
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Save Draft
                    </motion.button>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Keep your CV to 1-2 pages maximum</li>
                    <li>• Use action verbs to describe achievements</li>
                    <li>• Quantify your accomplishments with numbers</li>
                    <li>• Tailor your CV for each job application</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CV Generator</h1>
              <p className="text-gray-600 mt-1">Create a professional CV in minutes</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">Premium Feature</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12 max-w-6xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
            disabled={activeStep === 6}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeStep === 6 ? "Complete" : "Next"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
