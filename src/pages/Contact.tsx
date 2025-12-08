import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const WHATSAPP_URL = "https://wa.me/2250797721270";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Votre message a été envoyé avec succès !");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

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
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">Nos coordonnées</h2>
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

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-3xl p-8 shadow-soft">
                  <h2 className="text-2xl font-heading font-bold mb-8">Envoyez-nous un message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        placeholder="Sujet de votre message"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Votre message..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          Envoyer le message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
