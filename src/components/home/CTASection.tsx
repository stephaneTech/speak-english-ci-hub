import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6">
            Prêt à améliorer votre anglais ?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            Rejoignez des centaines d'apprenants satisfaits et commencez votre 
            transformation linguistique dès aujourd'hui.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/test-niveau">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto group">
                Tester mon niveau gratuitement
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a 
              href="https://wa.me/2250797721270" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                size="xl" 
                className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <MessageCircle className="w-5 h-5" />
                Nous contacter sur WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
