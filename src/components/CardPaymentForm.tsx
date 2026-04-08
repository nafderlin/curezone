import { useState, useMemo } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageContext";

interface CardPaymentFormProps {
  onCardValid: (valid: boolean) => void;
}

const detectCardType = (number: string): string | null => {
  const clean = number.replace(/\s/g, "");
  if (clean.startsWith("9860")) return "Humo";
  if (clean.startsWith("8600")) return "UzCard";
  if (clean.startsWith("4")) return "Visa";
  if (clean.startsWith("5")) return "Mastercard";
  return null;
};

const getCardColor = (type: string | null) => {
  switch (type) {
    case "Humo": return "text-green-600";
    case "UzCard": return "text-blue-600";
    case "Visa": return "text-indigo-600";
    case "Mastercard": return "text-orange-600";
    default: return "text-muted-foreground";
  }
};

const formatCardNumber = (value: string) => {
  const clean = value.replace(/\D/g, "").slice(0, 16);
  return clean.replace(/(.{4})/g, "$1 ").trim();
};

const CardPaymentForm = ({ onCardValid }: CardPaymentFormProps) => {
  const { t } = useLanguage();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const cardType = useMemo(() => detectCardType(cardNumber), [cardNumber]);
  const cleanNumber = cardNumber.replace(/\s/g, "");

  const isValid = cleanNumber.length === 16 && expiry.length === 5 && cvv.length >= 3;

  const handleCardChange = (val: string) => {
    const formatted = formatCardNumber(val);
    setCardNumber(formatted);
    const clean = formatted.replace(/\s/g, "");
    onCardValid(clean.length === 16 && expiry.length === 5 && cvv.length >= 3);
  };

  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) clean = clean.slice(0, 2) + "/" + clean.slice(2);
    setExpiry(clean);
    const cleanNum = cardNumber.replace(/\s/g, "");
    onCardValid(cleanNum.length === 16 && clean.length === 5 && cvv.length >= 3);
  };

  const handleCvvChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    setCvv(clean);
    const cleanNum = cardNumber.replace(/\s/g, "");
    onCardValid(cleanNum.length === 16 && expiry.length === 5 && clean.length >= 3);
  };

  return (
    <div className="space-y-4 mt-6 p-5 bg-secondary/50 rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="w-5 h-5 text-primary" />
        <span className="font-semibold text-foreground">{t.auth.cardDetails}</span>
      </div>

      <div>
        <Label>{t.auth.cardNumber}</Label>
        <div className="relative mt-1">
          <Input
            value={cardNumber}
            onChange={(e) => handleCardChange(e.target.value)}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
          />
          {cardType && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${getCardColor(cardType)}`}>
              {cardType}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{t.auth.cardExpiry}</Label>
          <Input
            value={expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            className="mt-1"
          />
        </div>
        <div>
          <Label>CVV</Label>
          <Input
            type="password"
            value={cvv}
            onChange={(e) => handleCvvChange(e.target.value)}
            placeholder="•••"
            maxLength={4}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
