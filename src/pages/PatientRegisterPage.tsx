import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, Scale, Ruler, Check, X, Crown, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import CardPaymentForm from "@/components/CardPaymentForm";

const patientSchema = z.object({
  age: z.number().min(1).max(150),
  weight: z.number().min(1).max(500),
  height: z.number().min(30).max(300).optional(),
});

const PatientRegisterPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [cardValid, setCardValid] = useState(false);

  const plans = [
    { id: "free", name: t.auth.planFree, price: t.auth.planFreePrice, monthlyLabel: "", icon: Sparkles, features: t.auth.planFreeFeatures, popular: false },
    { id: "plus", name: t.auth.planPlus, price: "29 990", monthlyLabel: "so'm/oy", icon: Crown, features: t.auth.planPlusFeatures, popular: true },
    { id: "family_plus", name: t.auth.planFamily, price: "79 990", monthlyLabel: "so'm/oy", icon: Users, features: t.auth.planFamilyFeatures, popular: false },
  ];

  const isPaidPlan = selectedPlan !== "free";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Avval tizimga kiring"); navigate("/login"); return; }
    const result = patientSchema.safeParse({ age: Number(age), weight: Number(weight), height: height ? Number(height) : undefined });
    if (!result.success) { toast.error("Ma'lumotlarni to'g'ri kiriting"); return; }
    setShowPlans(true);
  };

  const handleSelectPlan = async () => {
    if (!user) return;
    if (isPaidPlan && !cardValid) { toast.error("Karta ma'lumotlarini to'ldiring"); return; }
    setLoading(true);
    try {
      await supabase.from("user_roles").insert({ user_id: user.id, role: "patient" as const });
      const freeConsultations = selectedPlan === "free" ? 3 : selectedPlan === "plus" ? 15 : 999999;
      await supabase.from("patient_profiles").insert({
        user_id: user.id, age: Number(age), weight: Number(weight),
        height: height ? Number(height) : null, plan: selectedPlan, free_consultations_remaining: freeConsultations,
      });
      toast.success(t.auth.patientRegisterSuccess);
      navigate("/");
    } catch (err: any) { toast.error(err.message || "Xatolik yuz berdi"); } finally { setLoading(false); }
  };

  const handleSkipToHome = () => {
    if (!user) return;
    setSelectedPlan("free");
    handleSelectPlanFree();
  };

  const handleSelectPlanFree = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from("user_roles").insert({ user_id: user.id, role: "patient" as const });
      await supabase.from("patient_profiles").insert({
        user_id: user.id, age: Number(age), weight: Number(weight),
        height: height ? Number(height) : null, plan: "free", free_consultations_remaining: 3,
      });
      toast.success(t.auth.patientRegisterSuccess);
      navigate("/");
    } catch (err: any) { toast.error(err.message || "Xatolik yuz berdi"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 pb-10 px-4 sm:px-6">
      <AnimatePresence mode="wait">
        {!showPlans ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
            <div className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <UserRound className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t.auth.patientRegTitle}</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t.auth.patientRegSubtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <Label>{t.auth.age}</Label>
                  <Input type="number" min={1} max={150} value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className="mt-1" />
                </div>
                <div>
                  <Label>{t.auth.weight} (kg)</Label>
                  <div className="relative mt-1">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="number" min={1} max={500} value={weight} onChange={(e) => setWeight(e.target.value)} className="pl-10" placeholder="70" />
                  </div>
                </div>
                <div>
                  <Label>{t.auth.heightLabel} (cm)</Label>
                  <div className="relative mt-1">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="number" min={30} max={300} value={height} onChange={(e) => setHeight(e.target.value)} className="pl-10" placeholder="175" />
                  </div>
                </div>
                <Button type="submit" className="w-full h-10 sm:h-11">{t.auth.continue}</Button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div key="plans" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-4xl relative">
            {/* Close button to skip */}
            <button
              onClick={handleSkipToHome}
              disabled={loading}
              className="absolute top-0 right-0 sm:-top-2 sm:-right-2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="O'tkazib yuborish"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.auth.choosePlan}</h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">{t.auth.choosePlanSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative bg-card rounded-2xl shadow-card p-5 sm:p-6 border-2 cursor-pointer transition-all ${
                      isSelected ? "border-primary shadow-card-hover" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="gradient-hero text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">{t.auth.popular}</span>
                      </div>
                    )}
                    <div className="text-center mb-3 sm:mb-4 pt-2">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 ${isSelected ? "gradient-hero" : "bg-secondary"}`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">{plan.name}</h3>
                      <div className="mt-1">
                        <span className="text-xl sm:text-2xl font-bold text-primary">{plan.price}</span>
                        {plan.monthlyLabel && (
                          <span className="text-xs sm:text-sm text-muted-foreground ml-1">{plan.monthlyLabel}</span>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {isPaidPlan && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
                <CardPaymentForm onCardValid={setCardValid} />
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
              <Button variant="outline" onClick={() => setShowPlans(false)} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-1" /> {t.auth.back}
              </Button>
              <Button onClick={handleSelectPlan} disabled={loading || (isPaidPlan && !cardValid)} className="w-full sm:w-auto sm:min-w-[200px]">
                {loading ? t.auth.loading : isPaidPlan ? t.auth.payAndStart : t.auth.startNow}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientRegisterPage;
