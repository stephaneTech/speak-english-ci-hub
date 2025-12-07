import { Link } from "react-router-dom";
import { Check, Star, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const packs = [
  {
    name: "Starter",
    subtitle: "Idéal pour tester",
    price: "30 000",
    icon: Star,
    sessions: "2 séances/semaine",
    features: [
      "Durée : 1h par séance",
      "Supports PDF inclus",
      "Suivi par un coach",
      "Certificat de fin de formation",
    ],
    popular: false,
    color: "primary" as const,
  },
  {
    name: "Progression",
    subtitle: "Pour progresser",
    price: "45 000",
    icon: Zap,
    sessions: "3 séances/semaine",
    features: [
      "Durée : 1h par séance",
      "Supports PDF inclus",
      "Suivi par un coach",
      "Certificat de fin de formation",
    ],
    popular: true,
    color: "secondary" as const,
  },
  {
    name: "Intensif",
    subtitle: "Résultats rapides",
    price: "60 000",
    icon: Rocket,
    sessions: "4 séances/semaine",
    features: [
      "Durée : 1h par séance",
      "Supports PDF inclus",
      "Suivi par un coach",
      "Certificat de fin de formation",
    ],
    popular: false,
    color: "primary" as const,
  },
];

const PacksSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Nos Packs Coaching
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Choisissez le pack qui
            <span className="text-gradient"> vous convient</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Tous nos packs incluent un suivi personnalisé par un coach expérimenté 
            et un certificat à la fin de votre formation.
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packs.map((pack, index) => (
            <div
              key={pack.name}
              className={`relative bg-card rounded-3xl p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 ${
                pack.popular ? "ring-2 ring-secondary shadow-turquoise" : "hover:shadow-medium"
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium shadow-turquoise">
                  Le plus populaire
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  pack.color === "secondary" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                }`}>
                  <pack.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold">{pack.name}</h3>
                <p className="text-muted-foreground text-sm">{pack.subtitle}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-heading font-bold ${
                    pack.color === "secondary" ? "text-secondary" : "text-primary"
                  }`}>
                    {pack.price}
                  </span>
                  <span className="text-muted-foreground">F/mois</span>
                </div>
                <p className="text-sm font-medium mt-2">{pack.sessions}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {pack.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      pack.color === "secondary" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/contact">
                <Button 
                  variant={pack.color === "secondary" ? "turquoise" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Choisir ce pack
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;
