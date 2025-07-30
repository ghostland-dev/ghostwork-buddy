import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, TrendingUp, Clock, DollarSign } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Designer Freelance",
      company: "Studio Créatif",
      rating: 5,
      quote: "GhostWorker a révolutionné mon business ! Mes clients pensent que j'ai embauché un assistant. +40% de CA en 3 mois.",
      stats: { time: "15h/semaine", revenue: "+2.8k€/mois" },
      avatar: "🎨"
    },
    {
      name: "Thomas Martin",
      role: "Développeur Web",
      company: "TechSolutions",
      rating: 5,
      quote: "Incroyable ! L'IA répond aux clients pendant que je code. Mes devis sont maintenant envoyés en moins d'une heure.",
      stats: { time: "20h/semaine", revenue: "+4.2k€/mois" },
      avatar: "💻"
    },
    {
      name: "Sarah Levy",
      role: "Consultante Marketing",
      company: "Growth Agency",
      rating: 5,
      quote: "Mes prospects adorent ma 'réactivité'. GhostWorker gère les relances automatiquement. Plus jamais de client oublié !",
      stats: { time: "12h/semaine", revenue: "+3.5k€/mois" },
      avatar: "📈"
    },
    {
      name: "Lucas Moreau",
      role: "Photographe",
      company: "Moments Captés",
      rating: 5,
      quote: "Enfin je peux me concentrer sur la création ! GhostWorker s'occupe de toute la partie administrative. Magique !",
      stats: { time: "18h/semaine", revenue: "+2.1k€/mois" },
      avatar: "📸"
    },
    {
      name: "Emma Rousseau",
      role: "Rédactrice Web",
      company: "Plume Digital",
      rating: 5,
      quote: "L'IA imite parfaitement mon style d'écriture. Mes clients n'ont jamais soupçonné que ce n'était pas moi qui répondais !",
      stats: { time: "14h/semaine", revenue: "+1.9k€/mois" },
      avatar: "✍️"
    },
    {
      name: "Pierre Durand",
      role: "Coach Business",
      company: "Success Coaching",
      rating: 5,
      quote: "ROI immédiat ! GhostWorker s'est remboursé en 5 jours. Maintenant je peux accompagner plus de clients.",
      stats: { time: "25h/semaine", revenue: "+5.7k€/mois" },
      avatar: "🎯"
    }
  ];

  const stats = [
    { label: "Freelances satisfaits", value: "500+", icon: TrendingUp },
    { label: "Temps économisé/semaine", value: "15h", icon: Clock },
    { label: "Revenus supplémentaires", value: "+3.2k€", icon: DollarSign },
  ];

  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 mb-4">
            <Star className="w-3 h-3 mr-1" />
            Témoignages Clients
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ils ont révolutionné leur <span className="text-accent">business</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Découvrez comment GhostWorker transforme le quotidien des freelances et entrepreneurs
          </p>

          {/* Global Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border-ghost-gray/50 bg-card/50 backdrop-blur-sm hover:shadow-ghost transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ghost-primary/20 rounded-full flex items-center justify-center text-xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {testimonial.role} • {testimonial.company}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="relative">
                  <Quote className="w-8 h-8 text-ghost-primary/30 absolute -top-2 -left-2" />
                  <p className="text-sm leading-relaxed pl-6 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ghost-gray/30">
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{testimonial.stats.time}</div>
                    <div className="text-xs text-muted-foreground">économisées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{testimonial.stats.revenue}</div>
                    <div className="text-xs text-muted-foreground">de revenus</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="bg-card/30 backdrop-blur-sm border border-ghost-gray/50 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Rejoignez la révolution GhostWorker</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-accent">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction client</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">47s</div>
                <div className="text-sm text-muted-foreground">Temps de réponse</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">0%</div>
                <div className="text-sm text-muted-foreground">Détection IA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Disponibilité</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;