import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, UserRound, Heart } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const SelectRolePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 pb-10 px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t.auth.selectRole}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t.auth.selectRoleSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/register/doctor")}
            className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border hover:border-primary transition-colors text-left group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary flex items-center justify-center mb-3 sm:mb-4 group-hover:gradient-hero transition-colors">
              <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-primary-foreground" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{t.auth.doctor}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.auth.doctorDesc}</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/register/patient")}
            className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border hover:border-primary transition-colors text-left group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary flex items-center justify-center mb-3 sm:mb-4 group-hover:gradient-hero transition-colors">
              <UserRound className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-primary-foreground" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{t.auth.patient}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.auth.patientDesc}</p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectRolePage;
