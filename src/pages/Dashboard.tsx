import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Mail, 
  Zap, 
  TrendingUp, 
  Settings, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAutomations: 12,
    activeAutomations: 8,
    emailsSent: 247,
    timeSaved: 18
  });

  const automations = [
    {
      id: 1,
      name: "Relance clients prospects",
      type: "Email",
      status: "active",
      lastRun: "Il y a 2 heures",
      runs: 15,
      icon: Mail
    },
    {
      id: 2,
      name: "Génération devis automatique",
      type: "Document",
      status: "active",
      lastRun: "Il y a 30 min",
      runs: 8,
      icon: Zap
    },
    {
      id: 3,
      name: "Suivi réseaux sociaux",
      type: "Social",
      status: "paused",
      lastRun: "Il y a 1 jour",
      runs: 23,
      icon: TrendingUp
    }
  ];

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user.user_metadata?.name || user.email?.split('@')[0]} 👋
            </h1>
            <p className="text-muted-foreground">
              Voici un aperçu de vos automatisations GhostWorker
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/chat")}>
              <Bot className="w-4 h-4 mr-2" />
              Assistant IA
            </Button>
            <Button className="bg-gradient-ghost hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle automatisation
            </Button>
          </div>
        </div>

        {/* Subscription Status */}
        <Card className="mb-8 border-ghost-primary/30 bg-gradient-to-r from-ghost-primary/10 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-ghost-primary" />
                <div>
                  <CardTitle className="text-lg">
                    {subscription.subscribed ? `Plan ${subscription.subscription_tier}` : "Plan Gratuit"}
                  </CardTitle>
                  <CardDescription>
                    {subscription.subscribed 
                      ? `Renouvelé le ${subscription.subscription_end ? new Date(subscription.subscription_end).toLocaleDateString() : 'N/A'}`
                      : "Passez à un plan premium pour débloquer toutes les fonctionnalités"
                    }
                  </CardDescription>
                </div>
              </div>
              
              <Button 
                variant={subscription.subscribed ? "outline" : "default"}
                onClick={() => navigate("/pricing")}
              >
                {subscription.subscribed ? "Gérer l'abonnement" : "Passer à Premium"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Automatisations</CardTitle>
              <Zap className="h-4 w-4 text-ghost-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAutomations}</div>
              <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Automatisations Actives</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAutomations}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeAutomations / stats.totalAutomations) * 100)}% de taux d'activité
              </p>
            </CardContent>
          </Card>

          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
              <Mail className="h-4 w-4 text-ghost-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emailsSent}</div>
              <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
            </CardContent>
          </Card>

          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps Économisé</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.timeSaved}h</div>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Automatisations */}
          <div className="lg:col-span-2">
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Vos Automatisations</CardTitle>
                    <CardDescription>Gérez et surveillez vos processus automatisés</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Tout gérer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {automations.map((automation) => (
                  <div 
                    key={automation.id}
                    className="flex items-center justify-between p-4 border border-ghost-gray/30 rounded-lg hover:border-ghost-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <automation.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{automation.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {automation.type} • {automation.runs} exécutions • {automation.lastRun}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={automation.status === 'active' ? 'default' : 'secondary'}
                        className={automation.status === 'active' ? 'bg-accent text-accent-foreground' : ''}
                      >
                        {automation.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Actif
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pausé
                          </>
                        )}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une nouvelle automatisation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage */}
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <CardTitle className="text-lg">Usage ce mois-ci</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Emails automatiques</span>
                    <span>247/500</span>
                  </div>
                  <Progress value={49} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Automatisations actives</span>
                    <span>8/15</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Requêtes IA</span>
                    <span>89/200</span>
                  </div>
                  <Progress value={44} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Nouvelle campagne email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  Assistant IA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir les analytics
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Conseil du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatisez vos relances clients pour augmenter votre taux de conversion de 40% !
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-accent">
                  En savoir plus →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;