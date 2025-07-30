import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Plus, 
  Play,
  Pause,
  Settings,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  TrendingUp,
  FileText,
  Zap,
  Link,
  CheckCircle,
  XCircle,
  Globe,
  Key
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import IntegrationConfigModal from "@/components/IntegrationConfigModal";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  created_at: string;
}

interface EmailAutomation {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  status: string;
  send_count: number;
  last_run: string;
  created_at: string;
}

interface Integration {
  id: string;
  platform_name: string;
  platform_type: string;
  config: any;
  is_active: boolean;
  last_sync: string;
  created_at: string;
}

const AutomationsPage = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | undefined>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      // Load templates
      const { data: templatesData } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (templatesData) {
        setTemplates(templatesData);
      }

      // Load automations
      const { data: automationsData } = await supabase
        .from('email_automations')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (automationsData) {
        setAutomations(automationsData);
      }

      // Load integrations
      const { data: integrationsData } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (integrationsData) {
        setIntegrations(integrationsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTemplate = async () => {
    try {
      const defaultTemplate = {
        user_id: user!.id,
        name: "Template de Relance",
        subject: "Suivi de notre échange - {{company_name}}",
        content: `<h2>Bonjour {{client_name}},</h2>
        
        <p>J'espère que vous allez bien. Je reviens vers vous concernant notre échange du {{date_contact}}.</p>
        
        <p>Avez-vous eu l'occasion d'examiner notre proposition ?</p>
        
        <p>Je reste à votre disposition pour toute question.</p>
        
        <p>Cordialement,<br>{{sender_name}}</p>`,
        category: 'prospection',
        variables: {
          client_name: "Nom du client",
          company_name: "Nom de l'entreprise", 
          date_contact: "Date de contact",
          sender_name: "Votre nom"
        }
      };

      const { error } = await supabase
        .from('email_templates')
        .insert([defaultTemplate]);

      if (error) throw error;

      toast({
        title: "Template créé !",
        description: "Votre premier template email a été créé avec succès."
      });

      loadData();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le template.",
        variant: "destructive"
      });
    }
  };

  const toggleAutomationStatus = async (automationId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      const { error } = await supabase
        .from('email_automations')
        .update({ status: newStatus })
        .eq('id', automationId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Automatisation ${newStatus === 'active' ? 'activée' : 'mise en pause'}.`
      });

      loadData();
    } catch (error) {
      console.error('Error updating automation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
    }
  };

  const createIntegration = async (platformName: string, platformType: string, config: any) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .insert([{
          user_id: user!.id,
          platform_name: platformName,
          platform_type: platformType,
          config: config,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Intégration créée !",
        description: `${platformName} a été connecté avec succès.`
      });

      loadData();
    } catch (error) {
      console.error('Error creating integration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'intégration.",
        variant: "destructive"
      });
    }
  };

  const updateIntegration = async (integrationId: string, config: any) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ config: config, updated_at: new Date().toISOString() })
        .eq('id', integrationId);

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "L'intégration a été mise à jour avec succès."
      });

      loadData();
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'intégration.",
        variant: "destructive"
      });
    }
  };

  const handleIntegrationSave = async (platformName: string, platformType: string, config: any) => {
    if (selectedIntegration) {
      await updateIntegration(selectedIntegration.id, config);
    } else {
      await createIntegration(platformName, platformType, config);
    }
    setConfigModalOpen(false);
    setSelectedIntegration(undefined);
    setSelectedPlatform('');
  };

  const openConfigModal = (platform: string, integration?: Integration) => {
    setSelectedPlatform(platform);
    setSelectedIntegration(integration);
    setConfigModalOpen(true);
  };

  const toggleIntegrationStatus = async (integrationId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: !currentStatus })
        .eq('id', integrationId);

      if (error) throw error;

      toast({
        title: "Intégration mise à jour",
        description: `Intégration ${!currentStatus ? 'activée' : 'désactivée'}.`
      });

      loadData();
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'intégration.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghost-primary mx-auto mb-4"></div>
          <p>Chargement des automatisations...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Templates Email",
      value: templates.length,
      icon: FileText,
      description: "Templates disponibles"
    },
    {
      title: "Automatisations",
      value: automations.length,
      icon: Mail,
      description: "Campagnes créées"
    },
    {
      title: "Emails Envoyés",
      value: automations.reduce((sum, auto) => sum + auto.send_count, 0),
      icon: TrendingUp,
      description: "Ce mois-ci"
    },
    {
      title: "Intégrations",
      value: integrations.length,
      icon: Zap,
      description: "Plateformes connectées"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Automatisations Email</h1>
            <p className="text-muted-foreground">
              Gérez vos campagnes email automatisées et templates
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Retour au dashboard
            </Button>
            <Button className="bg-gradient-ghost hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle automatisation
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border-ghost-gray/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-ghost-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="automations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="automations">Automatisations</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          </TabsList>

          {/* Automations Tab */}
          <TabsContent value="automations">
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Vos Automatisations</CardTitle>
                    <CardDescription>Gérez vos campagnes email automatisées</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une automatisation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {automations.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune automatisation</h3>
                    <p className="text-muted-foreground mb-4">
                      Créez votre première automatisation email pour commencer
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer ma première automatisation
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Emails envoyés</TableHead>
                        <TableHead>Dernière exécution</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {automations.map((automation) => (
                        <TableRow key={automation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{automation.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {automation.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {automation.trigger_type === 'manual' && 'Manuel'}
                              {automation.trigger_type === 'schedule' && 'Programmé'}
                              {automation.trigger_type === 'event' && 'Événement'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={automation.status === 'active' ? 'default' : 'secondary'}
                              className={automation.status === 'active' ? 'bg-accent text-accent-foreground' : ''}
                            >
                              {automation.status === 'active' && 'Actif'}
                              {automation.status === 'paused' && 'Pausé'}
                              {automation.status === 'draft' && 'Brouillon'}
                            </Badge>
                          </TableCell>
                          <TableCell>{automation.send_count}</TableCell>
                          <TableCell>
                            {automation.last_run 
                              ? new Date(automation.last_run).toLocaleDateString()
                              : 'Jamais'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAutomationStatus(automation.id, automation.status)}
                              >
                                {automation.status === 'active' ? 
                                  <Pause className="w-4 h-4" /> : 
                                  <Play className="w-4 h-4" />
                                }
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Templates Email</CardTitle>
                    <CardDescription>Créez et gérez vos modèles d'emails</CardDescription>
                  </div>
                  <Button onClick={createDefaultTemplate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun template</h3>
                    <p className="text-muted-foreground mb-4">
                      Créez votre premier template email pour commencer
                    </p>
                    <Button onClick={createDefaultTemplate}>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer mon premier template
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                      <Card key={template.id} className="border-ghost-gray/30 hover:border-ghost-primary/50 transition-colors">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {template.category}
                              </CardDescription>
                            </div>
                            <Badge variant="outline">
                              {template.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Sujet :</h4>
                              <p className="text-sm text-muted-foreground">{template.subject}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="w-4 h-4 mr-1" />
                                Voir
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Intégrations Tierces</CardTitle>
                    <CardDescription>Connectez vos plateformes favorites pour automatiser vos workflows</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Platform Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Zapier Card */}
                    <Card className="border-ghost-gray/30 hover:border-ghost-primary/50 transition-colors">
                      <CardHeader className="text-center">
                        <div className="w-12 h-12 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-2">
                          <Zap className="w-6 h-6 text-orange-600" />
                        </div>
                        <CardTitle className="text-lg">Zapier</CardTitle>
                        <CardDescription>Connectez plus de 5000 applications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Statut:</span>
                            <Badge variant={integrations.find(i => i.platform_name === 'zapier')?.is_active ? "default" : "secondary"}>
                              {integrations.find(i => i.platform_name === 'zapier')?.is_active ? 'Connecté' : 'Déconnecté'}
                            </Badge>
                          </div>
                          {integrations.find(i => i.platform_name === 'zapier') ? (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  const integration = integrations.find(i => i.platform_name === 'zapier');
                                  if (integration) {
                                    toggleIntegrationStatus(integration.id, integration.is_active);
                                  }
                                }}
                              >
                                {integrations.find(i => i.platform_name === 'zapier')?.is_active ? (
                                  <Pause className="w-4 h-4 mr-1" />
                                ) : (
                                  <Play className="w-4 h-4 mr-1" />
                                )}
                                {integrations.find(i => i.platform_name === 'zapier')?.is_active ? 'Pause' : 'Activer'}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              className="w-full" 
                              onClick={() => openConfigModal('zapier')}
                            >
                              <Link className="w-4 h-4 mr-2" />
                              Connecter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Salesforce Card */}
                    <Card className="border-ghost-gray/30 hover:border-ghost-primary/50 transition-colors">
                      <CardHeader className="text-center">
                        <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
                          <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Salesforce</CardTitle>
                        <CardDescription>Synchronisez vos prospects et clients</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Statut:</span>
                            <Badge variant={integrations.find(i => i.platform_name === 'salesforce')?.is_active ? "default" : "secondary"}>
                              {integrations.find(i => i.platform_name === 'salesforce')?.is_active ? 'Connecté' : 'Déconnecté'}
                            </Badge>
                          </div>
                          {integrations.find(i => i.platform_name === 'salesforce') ? (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  const integration = integrations.find(i => i.platform_name === 'salesforce');
                                  if (integration) {
                                    toggleIntegrationStatus(integration.id, integration.is_active);
                                  }
                                }}
                              >
                                {integrations.find(i => i.platform_name === 'salesforce')?.is_active ? (
                                  <Pause className="w-4 h-4 mr-1" />
                                ) : (
                                  <Play className="w-4 h-4 mr-1" />
                                )}
                                {integrations.find(i => i.platform_name === 'salesforce')?.is_active ? 'Pause' : 'Activer'}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openConfigModal('salesforce', integrations.find(i => i.platform_name === 'salesforce'))}>
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              className="w-full" 
                              onClick={() => openConfigModal('salesforce')}
                            >
                              <Key className="w-4 h-4 mr-2" />
                              Connecter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Make.com Card */}
                    <Card className="border-ghost-gray/30 hover:border-ghost-primary/50 transition-colors">
                      <CardHeader className="text-center">
                        <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-2">
                          <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Make.com</CardTitle>
                        <CardDescription>Automatisez vos tâches complexes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Statut:</span>
                            <Badge variant={integrations.find(i => i.platform_name === 'make')?.is_active ? "default" : "secondary"}>
                              {integrations.find(i => i.platform_name === 'make')?.is_active ? 'Connecté' : 'Déconnecté'}
                            </Badge>
                          </div>
                          {integrations.find(i => i.platform_name === 'make') ? (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  const integration = integrations.find(i => i.platform_name === 'make');
                                  if (integration) {
                                    toggleIntegrationStatus(integration.id, integration.is_active);
                                  }
                                }}
                              >
                                {integrations.find(i => i.platform_name === 'make')?.is_active ? (
                                  <Pause className="w-4 h-4 mr-1" />
                                ) : (
                                  <Play className="w-4 h-4 mr-1" />
                                )}
                                {integrations.find(i => i.platform_name === 'make')?.is_active ? 'Pause' : 'Activer'}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openConfigModal('make', integrations.find(i => i.platform_name === 'make'))}>
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              className="w-full" 
                              onClick={() => openConfigModal('make')}
                            >
                              <Link className="w-4 h-4 mr-2" />
                              Connecter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Connected Integrations List */}
                  {integrations.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Intégrations Connectées</h3>
                      <div className="space-y-3">
                        {integrations.map((integration) => (
                          <div key={integration.id} className="flex items-center justify-between p-4 border border-ghost-gray/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-ghost-primary/10 rounded-lg flex items-center justify-center">
                                {integration.platform_name === 'zapier' && <Zap className="w-5 h-5 text-orange-600" />}
                                {integration.platform_name === 'salesforce' && <Globe className="w-5 h-5 text-blue-600" />}
                                {integration.platform_name === 'make' && <Settings className="w-5 h-5 text-purple-600" />}
                              </div>
                              <div>
                                <h4 className="font-medium capitalize">{integration.platform_name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Connecté le {new Date(integration.created_at).toLocaleDateString()}
                                  {integration.last_sync && ` • Dernière sync: ${new Date(integration.last_sync).toLocaleDateString()}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {integration.is_active ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <Button variant="ghost" size="sm" onClick={() => openConfigModal(integration.platform_name, integration)}>
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Config Modal */}
        <IntegrationConfigModal
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            setSelectedIntegration(undefined);
            setSelectedPlatform('');
          }}
          platform={selectedPlatform}
          integration={selectedIntegration}
          onSave={handleIntegrationSave}
        />
      </div>
    </div>
  );
};

export default AutomationsPage;