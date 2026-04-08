import { motion } from "framer-motion";
import { Heart, Target, Gem } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">{t.about.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-12">{t.about.desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-card shadow-card border border-border">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 sm:mb-4">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-2">{t.about.mission}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{t.about.missionDesc}</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-card shadow-card border border-border">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3 sm:mb-4">
                <Gem className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-2">{t.about.values}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{t.about.valuesDesc}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
