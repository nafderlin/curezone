export interface Doctor {
  id: string;
  name: string;
  specialization: { uz: string; ru: string };
  experience: number;
  rating: number;
  reviews: number;
  workplace: string;
  avatar: string;
  bio: { uz: string; ru: string };
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Aziza Karimova",
    specialization: { uz: "Kardiolog", ru: "Кардиолог" },
    experience: 12,
    rating: 4.9,
    reviews: 128,
    workplace: "Toshkent Tibbiyot Markazi",
    avatar: "",
    bio: { uz: "Yurak kasalliklari bo'yicha mutaxassis", ru: "Специалист по заболеваниям сердца" },
  },
  {
    id: "2",
    name: "Dr. Rustam Aliyev",
    specialization: { uz: "Nevrolog", ru: "Невролог" },
    experience: 8,
    rating: 4.8,
    reviews: 95,
    workplace: "Samarqand Klinikasi",
    avatar: "",
    bio: { uz: "Asab tizimi kasalliklari mutaxassisi", ru: "Специалист по заболеваниям нервной системы" },
  },
  {
    id: "3",
    name: "Dr. Nilufar Rahimova",
    specialization: { uz: "Tish shifokori", ru: "Стоматолог" },
    experience: 15,
    rating: 4.9,
    reviews: 210,
    workplace: "SmileCare Dental",
    avatar: "",
    bio: { uz: "Tish davolash va estetik stomatologiya", ru: "Лечение зубов и эстетическая стоматология" },
  },
  {
    id: "4",
    name: "Dr. Bobur Ismoilov",
    specialization: { uz: "Pediatr", ru: "Педиатр" },
    experience: 10,
    rating: 4.7,
    reviews: 176,
    workplace: "Bolalar Shifoxonasi",
    avatar: "",
    bio: { uz: "Bolalar sog'ligi mutaxassisi", ru: "Специалист по детскому здоровью" },
  },
  {
    id: "5",
    name: "Dr. Madina Yusupova",
    specialization: { uz: "Dermatolog", ru: "Дерматолог" },
    experience: 7,
    rating: 4.8,
    reviews: 89,
    workplace: "SkinCare Klinikasi",
    avatar: "",
    bio: { uz: "Teri kasalliklari bo'yicha mutaxassis", ru: "Специалист по кожным заболеваниям" },
  },
  {
    id: "6",
    name: "Dr. Sardor Toshmatov",
    specialization: { uz: "Ortoped", ru: "Ортопед" },
    experience: 20,
    rating: 5.0,
    reviews: 312,
    workplace: "Respublika Shifoxonasi",
    avatar: "",
    bio: { uz: "Suyak va bo'g'im kasalliklari", ru: "Заболевания костей и суставов" },
  },
];

export const specializations = [
  { uz: "Kardiolog", ru: "Кардиолог" },
  { uz: "Nevrolog", ru: "Невролог" },
  { uz: "Tish shifokori", ru: "Стоматолог" },
  { uz: "Pediatr", ru: "Педиатр" },
  { uz: "Dermatolog", ru: "Дерматолог" },
  { uz: "Ortoped", ru: "Ортопед" },
];
