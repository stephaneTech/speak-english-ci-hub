import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/80 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <div className="container relative py-12 sm:py-16 lg:py-24 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content - Left side */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-light leading-tight text-white animate-fade-in-up">
              Maîtrisez l'anglais,
              <span className="block font-normal">progressez vite</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-lg mx-auto lg:mx-0 animate-fade-in-up stagger-1">
              Coaching personnalisé et traductions certifiées pour tous vos projets professionnels.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-up stagger-2">
              <Link to="/coaching" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto group bg-white text-secondary hover:bg-white/90 rounded-full px-6 sm:px-8"
                >
                  Découvrir le Coaching
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/traduction" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto group border-white/30 text-white hover:bg-white/10 rounded-full px-6 sm:px-8"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Traduction Certifiée
                </Button>
              </Link>
            </div>
          </div>

          {/* Phone Mockup - Right side */}
          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            {/* Phone frame */}
            <div className="relative w-56 sm:w-72 md:w-80 lg:w-96 animate-fade-in-up">
              {/* Phone bezel */}
              <div className="relative bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-32 h-5 sm:h-7 bg-slate-900 rounded-b-xl sm:rounded-b-2xl z-20" />
                
                {/* Phone screen */}
                <div className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden aspect-[9/16]">
                  {/* Screen content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                    {/* Icon */}
                    <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 sm:mb-6">
                      <BookOpen className="w-7 sm:w-10 h-7 sm:h-10 text-white" />
                    </div>
                    
                    {/* App title */}
                    <h3 className="text-white font-heading font-bold text-lg sm:text-2xl mb-1 sm:mb-2">
                      SPEAK ENGLISH
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">CI</p>
                    
                    {/* Features */}
                    <div className="space-y-2 sm:space-y-3 text-left w-full">
                      <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white" />
                        <span className="text-white text-xs sm:text-sm">Coaching Personnalisé</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white" />
                        <span className="text-white text-xs sm:text-sm">Traduction Certifiée</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white" />
                        <span className="text-white text-xs sm:text-sm">Test de Niveau</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating price badge */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-primary text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg animate-float z-30">
                <span className="font-bold text-sm sm:text-base">9 000 FCFA</span>
                <span className="text-xs sm:text-sm opacity-90">/page</span>
              </div>

              {/* Floating coaching badge */}
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-white text-secondary rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg animate-float stagger-2 z-30">
                <span className="font-bold text-sm sm:text-base">À partir de 30 000</span>
                <span className="text-xs sm:text-sm opacity-90">/mois</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
