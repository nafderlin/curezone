import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const { t } = useLanguage();
  const faqs = [t.faq.q1, t.faq.q2, t.faq.q3, t.faq.q4];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">{t.faq.title}</h1>
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-card px-3 sm:px-4">
                <AccordionTrigger className="text-left font-semibold text-card-foreground hover:no-underline text-sm sm:text-base py-3 sm:py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
