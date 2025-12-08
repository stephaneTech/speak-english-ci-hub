import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

// Custom TikTok icon since lucide doesn't have it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container py-10 md:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Speak English CI" className="h-14 w-auto" />
              <div>
                <span className="text-xl font-heading font-bold">
                  SPEAK <span className="text-primary">ENGLISH</span> CI
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Votre partenaire pour maîtriser l'anglais et obtenir des traductions certifiées de qualité professionnelle.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/2250797721270" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-secondary transition-colors duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Nos Services</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/coaching" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Coaching en Anglais
                </Link>
              </li>
              <li>
                <Link to="/traduction" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Traduction Certifiée
                </Link>
              </li>
              <li>
                <Link to="/test-niveau" className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Test de Niveau
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens Utiles */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Liens Utiles</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cgu" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Conditions Générales
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Politique de Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:+2250797721270" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-3"
                >
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>+225 07 97 72 12 70</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:speakenglishciv@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-3"
                >
                  <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>speakenglishciv@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-muted/20">
        <div className="container py-4 md:py-6 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-xs sm:text-sm text-muted-foreground">
          <p>© {currentYear} Speak English CI. Tous droits réservés.</p>
          <p>Conçu avec ❤️ en CI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
