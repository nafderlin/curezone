import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ContactPage = () => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error(t.contact.fillAll || "Barcha maydonlarni to'ldiring");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, message },
      });
      if (error) throw error;
      toast.success(t.contact.sent || "Xabar yuborildi!");
      setName(""); setEmail(""); setMessage("");
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">{t.contact.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t.contact.name}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t.contact.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t.contact.message}</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <Button className="w-full" size="lg" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? t.auth?.loading || "Yuborilmoqda..." : t.contact.send}
              </Button>
            </form>

            <div className="space-y-5 sm:space-y-6">
              {[
                { icon: MapPin, label: t.contact.address, value: "Toshkent, O'zbekiston" },
                { icon: Phone, label: t.contact.phone, value: "+998 33 706 07 29" },
                { icon: Mail, label: "Email", value: "curezone.uz@gmail.com" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm sm:text-base">{item.label}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
