import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "29",
      description: "Parfait pour commencer",
      icon: Zap,
      features: [
        "Gestion emails automatique",
        "Génération devis (jusqu'à 50/mois)",
        "Relances intelligentes",
        "Support email",
        "1 signature personnalisée"
      ],
      cta: "Commencer l'essai",
      popular: false
    },
    {
      name: "Pro",
      price: "79",
      description: "Pour les freelances actifs",
      icon: Crown,
      features: [
        "Tout du plan Starter",
        "Devis illimités",
        "CRM automatisé",
        "Analytics avancées",
        "3 signatures d'équipe",
        "Intégrations Stripe/PayPal",
        "Support prioritaire"
      ],
      cta: "Choisir Pro",
      popular: true
    },
    {
      name: "Agency",
      price: "199",
      description: "Pour les agences et équipes",
      icon: Rocket,
      features: [
        "Tout du plan Pro",
        "Multi-utilisateurs (jusqu'à 10)",
        "Signatures d'équipe illimitées",
        "White-label complet",
        "API personnalisée",
        "Formation dédiée",
        "Support téléphone 24/7"
      ],
      cta: "Contacter les ventes",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 mb-4">
            <Crown className="w-3 h-3 mr-1" />
            Tarifs Transparents
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Investissez dans votre <span className="text-accent">liberté</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Payez une fois, économisez des heures chaque jour. GhostWorker se rembourse en moins d'une semaine.
          </p>

          {/* ROI Calculator */}
          <div className="bg-card/30 backdrop-blur-sm border border-ghost-gray/50 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">💰 Calculateur de ROI</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">2h/jour</div>
                <div className="text-sm text-muted-foreground">Temps économisé</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">50€/h</div>
                <div className="text-sm text-muted-foreground">Votre tarif moyen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">3000€/mois</div>
                <div className="text-sm text-muted-foreground">Revenus supplémentaires</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative transition-all duration-300 hover:shadow-ghost ${
                plan.popular 
                  ? 'ring-2 ring-ghost-primary border-ghost-primary bg-gradient-to-br from-ghost-primary/10 to-accent/5 scale-105' 
                  : 'border-ghost-gray/50 bg-card/50 backdrop-blur-sm hover:border-ghost-primary/30'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-ghost-primary text-primary-foreground">
                  ⭐ Plus populaire
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'bg-ghost-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <plan.icon className="w-6 h-6" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="pt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-muted-foreground">
            🎁 <strong>7 jours d'essai gratuit</strong> sur tous les plans • Sans engagement • Annulation en 1 clic
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              Remboursement 30 jours
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              Support français
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              Données sécurisées RGPD
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;