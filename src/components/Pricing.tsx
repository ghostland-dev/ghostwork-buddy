import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket, Loader2, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

const Pricing = () => {
  const [searchParams] = useSearchParams();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ subscribed: false });
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Stripe Price IDs from your Stripe dashboard
  const STRIPE_PRICES = {
    starter: "price_1RqaXNEDWgz2TvU1VcrmHMd1", // €29.00/month
    pro: "price_1RqaWxEDWgz2TvU1gEgRAURp",     // €79.00/month  
    agency: "price_1RqaVoEDWgz2TvU1iJjpiLxl"   // €199.00/month
  };

  const plans = [
    {
      name: "Starter",
      price: "29",
      description: "Parfait pour commencer",
      icon: Zap,
      stripePrice: STRIPE_PRICES.starter,
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
      stripePrice: STRIPE_PRICES.pro,
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
      stripePrice: STRIPE_PRICES.agency,
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

  // Check subscription status
  const checkSubscription = async () => {
    if (!user) return;
    
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  // Handle success/cancellation from Stripe
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Abonnement activé !",
        description: "Bienvenue dans GhostWorker Premium ! Votre abonnement est maintenant actif.",
      });
      // Refresh subscription status
      if (user) {
        setTimeout(checkSubscription, 2000);
      }
    }
    if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Paiement annulé",
        description: "Aucun problème ! Vous pouvez revenir quand vous le souhaitez.",
        variant: "destructive"
      });
    }
  }, [searchParams, user]);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour vous abonner.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;

      // Redirect to Stripe Customer Portal
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au portail client. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan = (planName: string) => {
    return subscriptionStatus.subscription_tier === planName;
  };

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

          {/* Subscription Status */}
          {user && (
            <div className="bg-card/30 backdrop-blur-sm border border-ghost-gray/50 rounded-xl p-4 max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between">
                <div>
                  {subscriptionStatus.subscribed ? (
                    <>
                      <div className="text-sm font-medium text-accent">
                        Plan actuel: {subscriptionStatus.subscription_tier}
                      </div>
                      {subscriptionStatus.subscription_end && (
                        <div className="text-xs text-muted-foreground">
                          Renouvellement: {new Date(subscriptionStatus.subscription_end).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun abonnement actif</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={checkSubscription}
                    disabled={checkingSubscription}
                  >
                    {checkingSubscription ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualiser"}
                  </Button>
                  {subscriptionStatus.subscribed && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleManageSubscription}
                      disabled={loading}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Gérer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

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
          {plans.map((plan, index) => {
            const isCurrent = isCurrentPlan(plan.name);
            return (
              <Card 
                key={index}
                className={`relative transition-all duration-300 hover:shadow-ghost ${
                  plan.popular 
                    ? 'ring-2 ring-ghost-primary border-ghost-primary bg-gradient-to-br from-ghost-primary/10 to-accent/5 scale-105' 
                    : 'border-ghost-gray/50 bg-card/50 backdrop-blur-sm hover:border-ghost-primary/30'
                } ${isCurrent ? 'ring-2 ring-accent border-accent' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-ghost-primary text-primary-foreground">
                    ⭐ Plus populaire
                  </Badge>
                )}
                
                {isCurrent && (
                  <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground">
                    Plan actuel
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
                    onClick={() => handleSubscribe(plan.stripePrice)}
                    disabled={loading || isCurrent || !user}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {isCurrent ? "Plan actuel" : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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