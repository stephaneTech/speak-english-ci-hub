import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://wa.me/2250797721270";

const Contact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-hero-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-lg text-muted-foreground">
              Une question ? Besoin d'informations ? N'hésitez pas à nous contacter, 
              nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-2xl font-heading font-bold mb-6 text-center">Nos coordonnées</h2>
            <div className="space-y-6">
              <a 
                href="tel:+2250797721270"
                className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-soft hover:shadow-medium transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-muted-foreground">+225 07 97 72 12 70</p>
                </div>
              </a>

              <a 
                href="mailto:speakenglishciv@gmail.com"
                className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-soft hover:shadow-medium transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">speakenglishciv@gmail.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Localisation</h3>
                  <p className="text-muted-foreground">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Horaires</h3>
                  <p className="text-muted-foreground">Disponible 24/24</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
              <div className="flex items-center gap-4 mb-4">
                <MessageCircle className="w-8 h-8" />
                <h3 className="font-heading font-bold text-lg">Réponse rapide</h3>
              </div>
              <p className="text-primary-foreground/90 mb-4">
                Pour une réponse plus rapide, contactez-nous directement sur WhatsApp.
              </p>
              <a href={WHATSAPP_URL}>
                <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <MessageCircle className="w-4 h-4" />
                  Ouvrir WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
