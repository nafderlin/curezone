import { motion } from "framer-motion";
import { UserPlus, Search, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: UserPlus, ...t.howItWorks.step1, num: "01" },
    { icon: Search, ...t.howItWorks.step2, num: "02" },
    { icon: MessageCircle, ...t.howItWorks.step3, num: "03" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 gradient-soft">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">{t.howItWorks.title}</h2>
          <p className="text-muted-foreground text-base sm:text-lg">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="text-5xl sm:text-6xl font-extrabold text-primary/10 mb-3 sm:mb-4">{step.num}</div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-hero">
                <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
