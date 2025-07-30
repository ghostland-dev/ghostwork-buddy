import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Mail, 
  FileText, 
  Target, 
  Shield, 
  TrendingUp, 
  Clock, 
  Zap,
  Users,
  DollarSign,
  Eye,
  Sparkles
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "IA Indétectable",
      description: "Imite parfaitement l'humain avec erreurs de frappe volontaires et style personnalisé",
      badge: "🎭 Furtif",
      highlight: true
    },
    {
      icon: Mail,
      title: "Gestion Emails Automatique",
      description: "Répond aux demandes clients, génère des devis en 47s avec votre signature",
      badge: "⚡ Rapide"
    },
    {
      icon: FileText,
      title: "Devis Intelligents",
      description: "Analyse les demandes et crée des propositions commerciales personnalisées",
      badge: "💼 Pro"
    },
    {
      icon: Target,
      title: "Relances Automatiques",
      description: "Suit les prospects, relance intelligemment avec variations de messages",
      badge: "🎯 Efficace"
    },
    {
      icon: Shield,
      title: "Sécurité Totale",
      description: "Chiffrement des données, connexions OAuth sécurisées Gmail/Outlook",
      badge: "🔒 Sécurisé"
    },
    {
      icon: TrendingUp,
      title: "Analytics Avancées",
      description: "Tableau de bord avec taux de conversion, € générés, temps économisé",
      badge: "📊 Data"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      stat: "47s",
      label: "Génération devis",
      description: "Vs 2h en manuel"
    },
    {
      icon: DollarSign,
      stat: "+40%",
      label: "CA moyen",
      description: "Grâce à la réactivité"
    },
    {
      icon: Eye,
      stat: "0%",
      label: "Détection client",
      description: "IA 100% invisible"
    },
    {
      icon: Users,
      stat: "24/7",
      label: "Disponibilité",
      description: "Même en vacances"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-ghost-primary/20 text-ghost-primary border-ghost-primary/30 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Fonctionnalités Révolutionnaires
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Votre <span className="text-ghost-primary">employé fantôme</span> parfait
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            GhostWorker automatise votre business pendant que vous vous concentrez sur ce qui compte vraiment. 
            Vos clients pensent parler à un humain ultra-réactif.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-ghost-gray/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <benefit.icon className="w-8 h-8 text-ghost-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-accent mb-1">{benefit.stat}</div>
                <div className="font-semibold text-foreground mb-1">{benefit.label}</div>
                <div className="text-sm text-muted-foreground">{benefit.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group transition-all duration-300 hover:shadow-ghost border-ghost-gray/50 ${
                feature.highlight ? 'ring-2 ring-ghost-primary/20 bg-gradient-to-br from-ghost-primary/5 to-transparent' : 'bg-card/50 backdrop-blur-sm'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <feature.icon className={`w-8 h-8 ${feature.highlight ? 'text-ghost-primary' : 'text-muted-foreground'} group-hover:text-ghost-primary transition-colors`} />
                  <Badge variant="outline" className="text-xs bg-background/50">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-ghost p-8 rounded-2xl text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">
              Prêt à embaucher votre employé fantôme ?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Rejoignez les 500+ freelances qui ont automatisé leur business avec GhostWorker
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Installation en 5 min
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                100% sécurisé
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Essai gratuit 7 jours
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;