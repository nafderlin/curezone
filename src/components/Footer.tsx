import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-primary-foreground py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CureZone</span>
          </div>
          <p className="text-sm opacity-70 text-center">{t.footer.description}</p>
          <p className="text-sm opacity-50 text-center">© 2026 CureZone. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
