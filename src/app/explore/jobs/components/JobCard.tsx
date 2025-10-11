// "use client";
// import { motion } from "framer-motion";
// import { MapPin, Briefcase } from "lucide-react";
// import { useState } from "react";
// import Link from "next/link";

// interface JobCardProps {
//   id: number;
//   slug: string;
//   title: string;
//   company: string;
//   logo: string;
//   city: string;
//   salary: string;
//   category: string;
//   tags: string[];
//   rating: number;
// }

// export function JobCard({
//   id,
//   slug,
//   title,
//   company,
//   logo,
//   city,
//   salary,
//   category,
//   tags,
// }: JobCardProps) {
//   const [isHovered, setIsHovered] = useState(false);

//   const formatSalary = (value: string) => {
//     if (!value) return "";
//     return value
//       .split("-")
//       .map((v) => {
//         const num = parseInt(v.trim().replace(/\D/g, ""));
//         if (isNaN(num)) return v;
//         return "IDR " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//       })
//       .join(" - ");
//   };

//   return (
//     <Link href={`/explore/jobs/${slug}`}>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         whileHover={{ y: -5 }}
//         onHoverStart={() => setIsHovered(true)}
//         onHoverEnd={() => setIsHovered(false)}
//         className="relative group"
//         aria-label={`${title} at ${company}`}
//       >
//         <div className="w-full max-w-full min-h-45 relative bg-[#F0F5F9] text-card-foreground rounded-2xl transition-all duration-300 overflow-hidden px-4 sm:px-6">
//           {/* Gradient Border on Hover */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0"
//             animate={{ opacity: isHovered ? 1 : 0 }}
//             transition={{ duration: 0.3 }}
//           />

//           <div className="relative p-4 sm:p-6">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-start gap-4">
//                 {/* Company Logo */}
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-2xl font-bold text-primary shadow-sm"
//                 >
//                   {logo ? (
//                     <img
//                       src={logo}
//                       alt={`${company} logo`}
//                       className="w-12 h-12 object-contain rounded-lg"
//                     />
//                   ) : (
//                     company.charAt(0)
//                   )}
//                 </motion.div>

//                 <div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-semibold text-[#467EC7] whitespace-nowrap overflow-hidden truncate max-w-[70vw] sm:max-w-[16rem]">
//                       {title}
//                     </h3>
//                   </div>
//                   <div className="flex items-center gap-3 mt-1">
//                     <span className="text-sm font-medium text-foreground/80">
//                       {company}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Job Details */}
//             <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
//               <div className="flex items-center gap-1">
//                 <MapPin
//                   className="w-4 h-4 text-muted-foreground/70"
//                   aria-hidden="true"
//                 />
//                 <span>{city}</span>
//               </div>
//               {salary && (
//                 <div className="flex items-center gap-1">
//                   <span className="font-medium">{formatSalary(salary)}</span>
//                 </div>
//               )}
//               <div className="flex items-center gap-1">
//                 <Briefcase
//                   className="w-4 h-4 text-muted-foreground/70"
//                   aria-hidden="true"
//                 />
//                 <span>{category}</span>
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="flex flex-wrap gap-2">
//               {tags.slice(0, 3).map((tag, index) => (
//                 <motion.span
//                   key={tag}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="px-3 py-1 bg-primary/3 text-primary text-xs font-medium rounded-full border border-primary/20"
//                 >
//                   {tag}
//                 </motion.span>
//               ))}
//               {tags.length > 3 && (
//                 <span className="px-3 py-1 bg-secondary text-muted-foreground text-xs font-medium rounded-full">
//                   +{tags.length - 3} more
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </Link>
//   );
// }

"use client";
import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface JobCardProps {
  id: number;
  slug: string;
  title: string;
  company: string;
  logo: string;
  city: string;
  salary: string;
  category: string;
  tags: string[];
  rating: number;
}

export function JobCard({
  id,
  slug,
  title,
  company,
  logo,
  city,
  salary,
  category,
  tags,
}: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatSalary = (value: string) => {
    if (!value) return "";
    return value
      .split("-")
      .map((v) => {
        const num = parseInt(v.trim().replace(/\D/g, ""));
        if (isNaN(num)) return v;
        return "IDR " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      })
      .join(" - ");
  };

  return (
    <Link
      href={`/explore/jobs/${slug}`}
      className="block w-full max-w-full overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group w-full max-w-full overflow-hidden"
        aria-label={`${title} at ${company}`}
      >
        <div className="w-full max-w-full bg-[#F0F5F9] text-card-foreground rounded-2xl transition-all duration-300 overflow-hidden box-border px-3 sm:px-5 py-4 sm:py-6">
          {/* Gradient Border on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-primary shadow-sm shrink-0"
            >
              {logo ? (
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
                />
              ) : (
                company.charAt(0)
              )}
            </motion.div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-[#467EC7] whitespace-nowrap overflow-hidden truncate max-w-[68vw] sm:max-w-[16rem]">
                {title}
              </h3>
              <span className="block text-sm font-medium text-foreground/80 mt-1 truncate">
                {company}
              </span>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground/70" />
              <span className="truncate">{city}</span>
            </div>
            {salary && (
              <div className="flex items-center gap-1">
                <span className="font-medium truncate">{formatSalary(salary)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-muted-foreground/70" />
              <span className="truncate">{category}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-2.5 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/20"
              >
                {tag}
              </motion.span>
            ))}
            {tags.length > 3 && (
              <span className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs font-medium rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
