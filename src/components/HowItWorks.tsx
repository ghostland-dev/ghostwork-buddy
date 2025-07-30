import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Brain, 
  Settings, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connexion Email",
      description: "Connectez votre Gmail ou Outlook en 2 clics via OAuth sécurisé",
      icon: Mail,
      features: ["OAuth 2.0 sécurisé", "Aucun mot de passe stocké", "Révocable à tout moment"],
      time: "2 min"
    },
    {
      number: "02", 
      title: "Configuration IA",
      description: "L'IA apprend votre style d'écriture en analysant vos emails précédents",
      icon: Brain,
      features: ["Analyse de style automatique", "Vocabulaire personnalisé", "Ton professionnel adapté"],
      time: "5 min"
    },
    {
      number: "03",
      title: "Paramétrage Smart",
      description: "Définissez vos tarifs, délais et templates de réponses",
      icon: Settings,
      features: ["Templates personnalisables", "Grille tarifaire intégrée", "Conditions commerciales"],
      time: "3 min"
    },
    {
      number: "04",
      title: "Automatisation Active",
      description: "GhostWorker traite vos emails et génère des réponses 24/7",
      icon: Zap,
      features: ["Réponses instantanées", "Relances automatiques", "Suivi de conversion"],
      time: "∞"
    },
    {
      number: "05",
      title: "Supervision & Analytics",
      description: "Suivez les performances et ajustez les paramètres en temps réel",
      icon: BarChart3,
      features: ["Dashboard en temps réel", "Métriques de conversion", "Rapports automatiques"],
      time: "5 min/jour"
    }
  ];

  return (
    <section className="py-24 bg-background" id="how-it-works">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-ghost-primary/20 text-ghost-primary border-ghost-primary/30 mb-4">
            <Settings className="w-3 h-3 mr-1" />
            Comment ça marche
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            De zéro à <span className="text-ghost-primary">employé fantôme</span> en 10 minutes
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Configuration ultra-simple, aucune compétence technique requise. 
            Votre assistant IA sera opérationnel avant votre pause café.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-ghost-primary to-ghost-secondary hidden lg:block" />
              )}
              
              <Card className="border-ghost-gray/50 bg-card/50 backdrop-blur-sm hover:shadow-ghost transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Step Number & Icon */}
                    <div className="flex items-center gap-4 lg:min-w-[200px]">
                      <div className="w-16 h-16 bg-gradient-ghost rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {step.number}
                      </div>
                      <div className="lg:hidden">
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <p className="text-sm text-accent">⏱️ {step.time}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="hidden lg:block mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <step.icon className="w-6 h-6 text-ghost-primary" />
                          <h3 className="text-xl font-bold">{step.title}</h3>
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                            {step.time}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className="grid sm:grid-cols-3 gap-3">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden flex justify-center mt-4">
                        <ArrowRight className="w-6 h-6 text-ghost-primary rotate-90" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div className="mt-16 text-center">
          <Card className="bg-ghost-primary/10 border-ghost-primary/30 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-ghost-primary" />
                <h3 className="text-2xl font-bold">Sécurité Garantie</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Vos données restent <strong>100% privées</strong>. GhostWorker utilise uniquement 
                des connexions OAuth officielles et ne stocke jamais vos mots de passe. 
                Conformité RGPD totale, serveurs européens certifiés.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Badge variant="outline" className="bg-background/50">🔒 Chiffrement AES-256</Badge>
                <Badge variant="outline" className="bg-background/50">🇪🇺 Serveurs européens</Badge>
                <Badge variant="outline" className="bg-background/50">✅ Conformité RGPD</Badge>
                <Badge variant="outline" className="bg-background/50">🛡️ OAuth 2.0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="xl" className="group">
            Configurer mon GhostWorker maintenant
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            ⚡ Configuration complète en moins de 10 minutes • 7 jours gratuits
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;