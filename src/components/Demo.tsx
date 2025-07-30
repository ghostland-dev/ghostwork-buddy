import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Sparkles, Clock, FileText, User, Bot } from "lucide-react";

const Demo = () => {
  const [customerRequest, setCustomerRequest] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState("");
  const [companyName, setCompanyName] = useState("MonEntreprise");

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const quotes = [
        `Bonjour,\n\nMerci pour votre demande concernant ${customerRequest.toLowerCase()}.\n\nAprès analyse de vos besoins, voici ma proposition :\n\n📋 Prestation : ${customerRequest}\n💰 Tarif : 1 850€ HT\n⏱️ Délai : 2-3 semaines\n\nCette proposition inclut :\n- Conception et développement\n- Tests et optimisation\n- Formation utilisateur\n- Support 30 jours\n\nJe reste disponible pour échanger sur les détails.\n\nBien cordialement,\nJean Dupont\n${companyName}`,
        `Salut !\n\nSuper projet que tu me proposes là ! 😊\n\nPour ${customerRequest.toLowerCase()}, je peux te faire quelque chose de vraiment qualitatif.\n\n🎯 Mon approche :\n- Analyse approfondie de tes besoins\n- Développement sur-mesure\n- Livraison en 10-15 jours\n\n💡 Prix : 2 200€ HT (tout compris)\n\nJ'ai déjà réalisé des projets similaires, je peux te montrer quelques références si ça t'intéresse.\n\nOn peut en discuter au téléphone cette semaine ?\n\nÀ bientôt,\nJean`
      ];
      
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setGeneratedQuote(randomQuote);
      setIsGenerating(false);
    }, 3000);
  };

  const demoRequests = [
    "Création d'un site web e-commerce",
    "Développement d'une application mobile",
    "Refonte de l'identité visuelle",
    "Optimisation SEO du site existant",
    "Formation équipe sur les réseaux sociaux"
  ];

  return (
    <section className="py-24 bg-background" id="demo">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 mb-4">
            <Play className="w-3 h-3 mr-1" />
            Démo Interactive
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Voir <span className="text-accent">GhostWorker</span> en action
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Testez notre IA en temps réel. Saisissez une demande client et découvrez comment 
            GhostWorker génère un devis professionnel en moins de 47 secondes.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Side */}
            <Card className="border-ghost-gray/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-ghost-primary" />
                  Demande Client
                </CardTitle>
                <CardDescription>
                  Simulez un email de demande de devis reçu dans votre boîte mail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Nom de votre entreprise</Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Votre entreprise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="request">Message du client</Label>
                  <Textarea
                    id="request"
                    value={customerRequest}
                    onChange={(e) => setCustomerRequest(e.target.value)}
                    placeholder="Exemple : Bonjour, j'aimerais créer un site web pour mon restaurant..."
                    rows={6}
                  />
                </div>

                {/* Quick Examples */}
                <div>
                  <Label className="text-sm text-muted-foreground">Exemples rapides :</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {demoRequests.map((request, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomerRequest(request)}
                        className="text-xs"
                      >
                        {request}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!customerRequest.trim() || isGenerating}
                  variant="hero"
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Génération en cours... 
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5 mr-2" />
                      Générer le devis IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Side */}
            <Card className="border-ghost-gray/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-accent" />
                  Réponse GhostWorker
                </CardTitle>
                <CardDescription>
                  Votre IA génère automatiquement une réponse professionnelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Analyse de la demande...
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-ghost-gray/30 rounded animate-pulse" />
                      <div className="h-4 bg-ghost-gray/30 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-ghost-gray/30 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ) : generatedQuote ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <FileText className="w-4 h-4" />
                      Devis généré en 2.3 secondes
                    </div>
                    <div className="bg-background/50 border border-ghost-gray/30 rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
                        {generatedQuote}
                      </pre>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ✨ Réponse automatique avec votre style d'écriture personnalisé
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Saisissez une demande pour voir la magie opérer...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          {generatedQuote && (
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-accent">2.3s</div>
                <div className="text-sm text-muted-foreground">Temps de génération</div>
              </div>
              <div className="bg-ghost-primary/10 border border-ghost-primary/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-ghost-primary">100%</div>
                <div className="text-sm text-muted-foreground">Personnalisé</div>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Disponible</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;