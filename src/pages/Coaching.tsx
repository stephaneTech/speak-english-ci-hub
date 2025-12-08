import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Check, Star, Zap, Rocket, Clock, Users, Award, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const openWhatsApp = (message?: string) => {
  const phone = "2250797721270";
  const url = message 
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phone}`;
  window.location.href = url;
};

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
      "Suivi par un coach dédié",
      "Certificat de fin de formation",
      "Accès au groupe WhatsApp",
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
      "Suivi par un coach dédié",
      "Certificat de fin de formation",
      "Accès au groupe WhatsApp",
      "Séances de conversation",
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
      "Suivi par un coach dédié",
      "Certificat de fin de formation",
      "Accès au groupe WhatsApp",
      "Séances de conversation",
      "Accompagnement prioritaire",
    ],
    popular: false,
    color: "primary" as const,
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Flexibilité Horaire",
    description: "Planifiez vos séances selon votre emploi du temps, en semaine ou le week-end.",
  },
  {
    icon: Users,
    title: "Coachs Expérimentés",
    description: "Nos coachs sont certifiés et ont des années d'expérience dans l'enseignement.",
  },
  {
    icon: Award,
    title: "Certification",
    description: "Recevez un certificat officiel à la fin de votre formation.",
  },
];

const Coaching = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-hero-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Coaching en Anglais
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Apprenez l'anglais avec
              <span className="text-gradient"> des experts</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              Progressez rapidement grâce à un accompagnement personnalisé par des coachs 
              expérimentés. Choisissez le pack qui correspond à vos objectifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/test-niveau">
                <Button size="lg" className="w-full sm:w-auto">
                  Tester mon niveau gratuitement
                </Button>
              </Link>
              <a href="#packs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Voir les packs
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packs Section */}
      <section id="packs" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              Nos Formules
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Choisissez votre pack
            </h2>
            <p className="text-muted-foreground text-lg">
              Tous nos packs incluent un suivi personnalisé et un certificat de formation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packs.map((pack, index) => (
              <div
                key={pack.name}
                className={`relative bg-card rounded-3xl p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 ${
                  pack.popular ? "ring-2 ring-secondary shadow-turquoise" : "hover:shadow-medium"
                }`}
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

                <Button 
                  variant={pack.color === "secondary" ? "turquoise" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={() => openWhatsApp(`Bonjour, je suis intéressé(e) par le pack ${pack.name} à ${pack.price} FCFA/mois.`)}
                >
                  <MessageCircle className="w-4 h-4" />
                  S'inscrire via WhatsApp
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-6">
              Des questions sur nos formations ?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Contactez-nous sur WhatsApp pour plus d'informations ou pour vous inscrire.
            </p>
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => openWhatsApp("Bonjour, j'aimerais avoir plus d'informations sur vos formations.")}
            >
              <MessageCircle className="w-5 h-5" />
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Coaching;
