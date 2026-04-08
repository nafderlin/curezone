import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Upload, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const specializations = [
  "Kardiolog", "Nevrolog", "Dermatolog", "Pediatr", "Terapevt",
  "Stomatolog", "Oftalmolog", "LOR", "Urolog", "Ginekolog",
  "Endokrinolog", "Psixiatr", "Ortoped", "Xirurg", "Onkolog",
];

const doctorSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  specialization: z.string().min(1),
  experienceYears: z.number().min(0).max(70),
  workplace: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(1000).optional(),
});

const DoctorRegisterPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [bio, setBio] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Avval tizimga kiring");
      navigate("/login");
      return;
    }

    const result = doctorSchema.safeParse({
      fullName,
      specialization,
      experienceYears: Number(experienceYears),
      workplace: workplace || undefined,
      bio: bio || undefined,
    });

    if (!result.success) {
      toast.error("Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    try {
      let certificateUrl = null;

      if (certificate) {
        const fileExt = certificate.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("certificates")
          .upload(filePath, certificate);
        if (uploadError) throw uploadError;
        certificateUrl = filePath;
      }

      // Insert role
      await supabase.from("user_roles").insert({
        user_id: user.id,
        role: "doctor" as const,
      });

      // Insert doctor profile
      await supabase.from("doctor_profiles").insert({
        user_id: user.id,
        full_name: fullName,
        specialization,
        experience_years: Number(experienceYears),
        workplace: workplace || null,
        bio: bio || null,
        certificate_url: certificateUrl,
      });

      toast.success(t.auth.doctorRegisterSuccess);
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 pb-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t.auth.doctorRegTitle}</h1>
            <p className="text-muted-foreground mt-1">{t.auth.doctorRegSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t.auth.fullName}</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.auth.fullNamePlaceholder}
                maxLength={100}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{t.auth.specialization}</Label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t.auth.selectSpecialization} />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t.auth.experience}</Label>
              <div className="relative mt-1">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={0}
                  max={70}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="pl-10"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <Label>{t.auth.workplace}</Label>
              <Input
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
                placeholder={t.auth.workplacePlaceholder}
                maxLength={200}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{t.auth.bio}</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.auth.bioPlaceholder}
                maxLength={1000}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>{t.auth.certificate}</Label>
              <div className="mt-1 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById("cert-upload")?.click()}
              >
                {certificate ? (
                  <div className="flex items-center gap-2 justify-center text-foreground">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm">{certificate.name}</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">{t.auth.uploadCertificate}</p>
                  </div>
                )}
                <input
                  id="cert-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? t.auth.loading : t.auth.submitDoctor}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorRegisterPage;
