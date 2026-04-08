import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface DoctorProfile {
  id: string;
  full_name: string;
  specialization: string;
  experience_years: number;
  workplace: string | null;
  bio: string | null;
  rating: number | null;
  consultations_count: number | null;
}

const DoctorsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [specs, setSpecs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 24;

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await supabase
        .from("doctor_profiles")
        .select("id, full_name, specialization, experience_years, workplace, bio, rating, consultations_count")
        .eq("is_verified", true)
        .order("rating", { ascending: false });

      if (data) {
        setDoctors(data);
        const uniqueSpecs = [...new Set(data.map((d) => d.specialization))].sort();
        setSpecs(uniqueSpecs);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const filtered = useMemo(() => doctors.filter((doc) => {
    const matchesSearch =
      doc.full_name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = !selectedSpec || doc.specialization === selectedSpec;
    return matchesSearch && matchesSpec;
  }), [doctors, search, selectedSpec]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [search, selectedSpec]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">{t.doctorDirectory.title}</h1>
          <p className="text-muted-foreground text-base sm:text-lg">{t.doctorDirectory.subtitle}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3 sm:space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.doctorDirectory.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedSpec("")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                !selectedSpec ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {t.doctorDirectory.allSpecs}
            </button>
            {specs.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpec(spec)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedSpec === spec
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-20">{t.auth.loading}</div>
        ) : (
          <>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {filtered.length} ta shifokor topildi
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginated.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="p-4 sm:p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover border border-border transition-all duration-300"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-lg shrink-0">
                    {doc.full_name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-card-foreground truncate text-sm sm:text-base">{doc.full_name}</h3>
                    <p className="text-xs sm:text-sm text-primary font-medium">{doc.specialization}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">{doc.bio}</p>

                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {doc.experience_years} {t.doctorDirectory.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    {doc.rating} ({doc.consultations_count})
                  </span>
                  {doc.workplace && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="truncate max-w-[120px]">{doc.workplace}</span>
                    </span>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => user ? navigate(`/consultation?doctor=${encodeURIComponent(doc.full_name)}&spec=${encodeURIComponent(doc.specialization)}`) : navigate("/login")}
                >
                  {t.doctorDirectory.consult}
                </Button>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted-foreground px-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
