import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Clock, TrendingUp } from "lucide-react";
import ghostHero from "@/assets/ghost-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-ghost-primary/20 text-ghost-primary border-ghost-primary/30">
                <Zap className="w-3 h-3 mr-1" />
                Révolutionnaire 2025
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-foreground to-ghost-light bg-clip-text text-transparent leading-tight">
                GhostWorker
              </h1>
              
              <p className="text-xl lg:text-2xl text-ghost-light font-medium">
                Le premier <span className="text-ghost-primary font-bold">"employé fantôme"</span> généré par IA
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Automatisez vos tâches business (devis, relances, veille) sans que vos clients 
                ne sachent que c'est une IA. <span className="text-accent font-semibold">Gagnez de l'argent en dormant.</span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">47s</div>
                <div className="text-sm text-muted-foreground">Génération devis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">80%</div>
                <div className="text-sm text-muted-foreground">Freelances intéressés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Disponibilité</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Commencer l'essai gratuit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="xl" className="border-ghost-primary/30 text-ghost-primary hover:bg-ghost-primary/10">
                Voir la démo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                7 jours gratuits
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Sans engagement
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative animate-float">
              <img 
                src={ghostHero} 
                alt="GhostWorker AI Assistant" 
                className="w-full h-auto rounded-2xl shadow-ghost"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold animate-pulse-slow">
              💰 +14.5k€/mois
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-ghost-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold animate-glow">
              🤖 100% Indétectable
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;