import { Link } from "react-router-dom";
import { BookOpen, FileText, ClipboardCheck, ArrowRight, Clock, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: BookOpen,
    title: "Coaching en Anglais",
    description: "Progressez rapidement avec un accompagnement personnalisé par des coachs expérimentés.",
    features: ["Séances individuelles ou en groupe", "Supports PDF fournis", "Certificat à la fin"],
    link: "/coaching",
    color: "primary" as const,
  },
  {
    icon: FileText,
    title: "Traduction Certifiée",
    description: "Traduction professionnelle de tous vos documents officiels avec certification.",
    features: ["9 000 FCFA par page", "Livraison en 24h à 72h", "Certification officielle"],
    link: "/traduction",
    color: "secondary" as const,
  },
  {
    icon: ClipboardCheck,
    title: "Test de Niveau",
    description: "Évaluez gratuitement votre niveau d'anglais et recevez des recommandations personnalisées.",
    features: ["Test gratuit en ligne", "Résultat immédiat", "Conseils personnalisés"],
    link: "/test-niveau",
    color: "primary" as const,
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nos Services
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Tout ce dont vous avez besoin pour
            <span className="text-gradient"> réussir en anglais</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Du coaching personnalisé à la traduction certifiée, nous vous accompagnons 
            dans toutes vos démarches linguistiques.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group bg-card rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                service.color === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
              }`}>
                <service.icon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-heading font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      service.color === "primary" ? "bg-primary" : "bg-secondary"
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={service.link}>
                <Button 
                  variant={service.color === "primary" ? "default" : "turquoise"}
                  className="w-full group/btn"
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-card shadow-soft">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <h4 className="font-heading font-bold text-lg mb-2">Livraison Rapide</h4>
            <p className="text-muted-foreground text-sm">Traductions livrées en 24h à 72h selon le volume</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card shadow-soft">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-secondary" />
            </div>
            <h4 className="font-heading font-bold text-lg mb-2">Traduction Certifiée</h4>
            <p className="text-muted-foreground text-sm">Documents officiellement reconnus</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card shadow-soft">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <h4 className="font-heading font-bold text-lg mb-2">Certificat Inclus</h4>
            <p className="text-muted-foreground text-sm">Certificat de formation pour le coaching</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
