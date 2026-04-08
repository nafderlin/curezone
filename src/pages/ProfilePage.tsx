import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Save, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProfilePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setEmail(user.email || "");
    const loadProfile = async () => {
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle();
      if (profile?.full_name) setFullName(profile.full_name);
      if (userRole === "patient") {
        const { data: patient } = await supabase.from("patient_profiles").select("age, weight, height").eq("user_id", user.id).maybeSingle();
        if (patient) {
          setAge(patient.age?.toString() || "");
          setWeight(patient.weight?.toString() || "");
          setHeight(patient.height?.toString() || "");
        }
      }
    };
    loadProfile();
  }, [user, userRole, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from("profiles").update({ full_name: fullName }).eq("user_id", user.id);
      if (userRole === "patient") {
        await supabase.from("patient_profiles").update({
          age: age ? Number(age) : null, weight: weight ? Number(weight) : null, height: height ? Number(height) : null,
        }).eq("user_id", user.id);
      }
      toast.success(t.auth.profileSaved);
    } catch { toast.error("Xatolik yuz berdi"); } finally { setLoading(false); }
  };

  const handleLogout = async () => { await signOut(); navigate("/"); };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 pb-10 px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t.auth.profile}</h1>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label>{t.auth.fullName}</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} disabled className="mt-1 opacity-60" />
            </div>
            {userRole === "patient" && (
              <>
                <div>
                  <Label>{t.auth.age}</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>{t.auth.weight} (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>{t.auth.heightLabel} (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1" />
                </div>
              </>
            )}
            <Button onClick={handleSave} className="w-full h-10 sm:h-11" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? t.auth.loading : t.auth.saveChanges}
            </Button>
            <Button variant="destructive" onClick={() => setShowLogoutDialog(true)} className="w-full h-10 sm:h-11">
              <LogOut className="w-4 h-4 mr-2" />
              {t.auth.logout}
            </Button>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="mx-4 sm:mx-auto max-w-sm sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {t.auth.logoutTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">{t.auth.logoutReminder}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">{t.auth.back}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="w-full sm:w-auto">{t.auth.logoutConfirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;
