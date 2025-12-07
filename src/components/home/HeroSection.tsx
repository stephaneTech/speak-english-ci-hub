import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero-pattern">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-primary/5 to-transparent" />
      </div>

      <div className="container relative py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Coaching en Anglais & Traduction Certifiée
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight animate-fade-in-up">
              Maîtrisez l'anglais
              <span className="block text-gradient">avec Speak English</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up stagger-1">
              Progressez rapidement grâce à notre coaching personnalisé et obtenez des 
              traductions certifiées pour tous vos documents officiels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-2">
              <Link to="/coaching">
                <Button size="xl" className="w-full sm:w-auto group">
                  Découvrir le Coaching
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/traduction">
                <Button variant="turquoise" size="xl" className="w-full sm:w-auto group">
                  Commander une Traduction
                  <FileText className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Traduction Certifiée</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span>Coachs Expérimentés</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Livraison Rapide</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              {/* Main card */}
              <div className="bg-card rounded-3xl shadow-strong p-8 animate-float">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl">Coaching Anglais</h3>
                    <p className="text-muted-foreground">Progression garantie</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">2 à 4 séances par semaine</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-sm">Supports PDF inclus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">Certificat de fin de formation</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground rounded-2xl px-4 py-2 shadow-orange animate-slide-in-right">
                <span className="font-bold">9 000 FCFA</span>
                <span className="text-sm opacity-90">/page</span>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground rounded-2xl px-4 py-2 shadow-turquoise animate-slide-in-right stagger-2">
                <span className="font-bold">À partir de 30 000 FCFA</span>
                <span className="text-sm opacity-90">/mois</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full border-2 border-dashed border-primary/20 -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border-2 border-dashed border-secondary/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
