import { Ghost, Twitter, Linkedin, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ghostLogo from "@/assets/ghost-logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-ghost-gray/30">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={ghostLogo} alt="GhostWorker" className="w-8 h-8" />
              <span className="text-xl font-bold">GhostWorker</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Le premier employé fantôme IA pour automatiser votre business. 
              Gagnez du temps, augmentez vos revenus.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:text-ghost-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-ghost-primary">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-ghost-primary">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="font-semibold">Produit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a></li>
              <li><a href="#demo" className="hover:text-foreground transition-colors">Démo en ligne</a></li>
              <li><a href="#integrations" className="hover:text-foreground transition-colors">Intégrations</a></li>
              <li><a href="#api" className="hover:text-foreground transition-colors">API</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="font-semibold">Ressources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#blog" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#help" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
              <li><a href="#guides" className="hover:text-foreground transition-colors">Guides</a></li>
              <li><a href="#templates" className="hover:text-foreground transition-colors">Templates</a></li>
              <li><a href="#community" className="hover:text-foreground transition-colors">Communauté</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="font-semibold">Entreprise</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">À propos</a></li>
              <li><a href="#careers" className="hover:text-foreground transition-colors">Carrières</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#privacy" className="hover:text-foreground transition-colors">Confidentialité</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-colors">CGU</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-ghost-gray/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 GhostWorker. Tous droits réservés. Fait avec 👻 en France.
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-xs text-muted-foreground">
              🔒 Données sécurisées RGPD
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={scrollToTop}
              className="hover:text-ghost-primary"
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              Haut de page
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;