import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ghost, Menu, X } from "lucide-react";
import { useState } from "react";
import ghostLogo from "@/assets/ghost-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-ghost-gray/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={ghostLogo} alt="GhostWorker" className="w-8 h-8" />
            <span className="text-xl font-bold">GhostWorker</span>
            <Badge variant="outline" className="bg-ghost-primary/20 text-ghost-primary border-ghost-primary/30 text-xs">
              BETA
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Comment ça marche
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Démo
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Tarifs
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
            <Button variant="hero" size="sm">
              Essai gratuit
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-ghost-gray/30">
            <nav className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={toggleMenu}
              >
                Fonctionnalités
              </a>
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={toggleMenu}
              >
                Tarifs
              </a>
              <a 
                href="#demo" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={toggleMenu}
              >
                Démo
              </a>
              <a 
                href="#contact" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={toggleMenu}
              >
                Contact
              </a>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-ghost-gray/30">
                <Button variant="ghost">
                  Connexion
                </Button>
                <Button variant="hero">
                  Essai gratuit
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;