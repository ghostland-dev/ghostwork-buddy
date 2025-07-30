import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const TestAccountCreator = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "test123456",
    full_name: "",
    role: "client" as "client" | "admin",
    company: ""
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateTestData = (role: "client" | "admin") => {
    const timestamp = Date.now();
    const isAdmin = role === "admin";
    
    setFormData({
      email: isAdmin ? `admin${timestamp}@ghostworker.test` : `client${timestamp}@test.com`,
      password: "test123456",
      full_name: isAdmin ? `Admin Test ${timestamp}` : `Client Test ${timestamp}`,
      role,
      company: isAdmin ? "GhostWorker Admin" : `Entreprise Test ${timestamp}`
    });
  };

  const createTestAccount = async () => {
    if (!user || !formData.email || !formData.full_name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-test-account', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Compte créé avec succès !",
        description: `Compte ${formData.role} créé pour ${formData.email}`,
      });

      // Reset form
      setFormData({
        email: "",
        password: "test123456",
        full_name: "",
        role: "client",
        company: ""
      });

    } catch (error) {
      console.error('Error creating test account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte de test. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-ghost-gray/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Créer des Comptes de Test
        </CardTitle>
        <CardDescription>
          Générez rapidement des comptes clients et administrateurs pour les tests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Generate Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => generateTestData("client")}
            className="flex-1"
          >
            <User className="w-4 h-4 mr-2" />
            Générer Client
          </Button>
          <Button 
            variant="outline" 
            onClick={() => generateTestData("admin")}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" />
            Générer Admin
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@test.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="test123456"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Jean Dupont"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Client
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Administrateur
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Nom de l'entreprise"
            />
          </div>
        </div>

        {/* Preview */}
        {formData.email && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Aperçu du compte :</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-mono">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Nom:</span>
                <span>{formData.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Rôle:</span>
                <Badge variant={formData.role === 'admin' ? 'default' : 'secondary'}>
                  {formData.role === 'admin' ? 'Administrateur' : 'Client'}
                </Badge>
              </div>
              {formData.company && (
                <div className="flex justify-between">
                  <span>Entreprise:</span>
                  <span>{formData.company}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Button */}
        <Button 
          onClick={createTestAccount} 
          disabled={loading || !formData.email || !formData.full_name}
          className="w-full bg-gradient-ghost hover:opacity-90"
        >
          {loading ? "Création..." : "Créer le Compte de Test"}
        </Button>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Instructions :</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilisez les boutons "Générer" pour créer rapidement des données de test</li>
            <li>Les comptes créés auront leur email automatiquement confirmé</li>
            <li>Mot de passe par défaut : <code className="bg-muted px-1 rounded">test123456</code></li>
            <li>Les administrateurs peuvent accéder au dashboard admin</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAccountCreator;