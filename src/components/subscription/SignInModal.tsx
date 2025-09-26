import { motion } from "framer-motion";
import { LogIn, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background rounded-3xl p-8 max-w-md w-full border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#467ec7]/10 rounded-full mb-6">
            <LogIn className="w-8 h-8 text-[#467ec7]" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Sign In Required
          </h3>
          
          <p className="text-muted-foreground mb-8">
            You need to sign in to your account before choosing a subscription plan. 
            Create an account or sign in to continue.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/auth/signin')}
              className="w-full px-6 py-3 bg-[#467ec7] text-white font-semibold rounded-xl hover:bg-[#578BCC] transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Sign In
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/auth/signup')}
              className="w-full px-6 py-3 border-2 border-[#467ec7] text-[#467ec7] font-semibold rounded-xl hover:bg-[#467ec7] hover:text-white transition-colors"
            >
              Create Account
            </motion.button>
            
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
