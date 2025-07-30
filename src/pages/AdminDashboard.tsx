import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Crown, 
  TrendingUp, 
  DollarSign,
  Activity,
  UserCheck,
  Settings,
  Mail,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import TestAccountCreator from "@/components/TestAccountCreator";

interface AdminStats {
  total_users: number;
  active_subscribers: number;
  total_revenue: number;
  total_automations: number;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    active_subscribers: 0,
    total_revenue: 0,
    total_automations: 0
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile?.role !== 'admin') {
          navigate("/dashboard");
          return;
        }

        setIsAdmin(true);
        await loadAdminData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate("/dashboard");
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const loadAdminData = async () => {
    try {
      // Load stats
      const { data: statsData } = await supabase
        .from('admin_stats')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (statsData) {
        setStats(statsData);
      }

      // Load users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (usersData) {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      // Refresh users list
      await loadAdminData();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghost-primary mx-auto mb-4"></div>
          <p>Chargement du dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Administrateur</h1>
            <p className="text-muted-foreground">
              Gérez votre plateforme GhostWorker
            </p>
          </div>
          
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Retour au dashboard
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
              <Users className="h-4 w-4 text-ghost-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <p className="text-xs text-muted-foreground">+12% ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnés Actifs</CardTitle>
              <Crown className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_subscribers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.active_subscribers / stats.total_users) * 100)}% de conversion
              </p>
            </CardContent>
          </Card>

          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <DollarSign className="h-4 w-4 text-ghost-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_revenue.toLocaleString()}€</div>
              <p className="text-xs text-muted-foreground">+23% vs mois dernier</p>
            </CardContent>
          </Card>

          <Card className="border-ghost-gray/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Automatisations</CardTitle>
              <Activity className="h-4 w-4 text-ghost-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_automations}</div>
              <p className="text-xs text-muted-foreground">Créées par les utilisateurs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Management */}
          <div className="lg:col-span-2">
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                    <CardDescription>Derniers utilisateurs inscrits</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Gérer tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userProfile) => (
                      <TableRow key={userProfile.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {userProfile.full_name || userProfile.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {userProfile.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={userProfile.role === 'admin' ? 'default' : 'secondary'}
                            className={userProfile.role === 'admin' ? 'bg-ghost-primary text-primary-foreground' : ''}
                          >
                            {userProfile.role === 'admin' ? 'Admin' : 'Client'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {userProfile.company || 'Non renseigné'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(userProfile.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => 
                              updateUserRole(
                                userProfile.id, 
                                userProfile.role === 'admin' ? 'client' : 'admin'
                              )
                            }
                          >
                            {userProfile.role === 'admin' ? 'Rétrograder' : 'Promouvoir'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Test Account Creator */}
            <TestAccountCreator />
            
            {/* Quick Actions */}
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email aux utilisateurs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Rapport mensuel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres système
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-ghost-gray/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-accent" />
                  Statut Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-accent text-accent-foreground">Opérationnel</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base de données</span>
                  <Badge className="bg-accent text-accent-foreground">Opérationnel</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Paiements Stripe</span>
                  <Badge className="bg-accent text-accent-foreground">Opérationnel</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">IA OpenAI</span>
                  <Badge className="bg-accent text-accent-foreground">Opérationnel</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  2 nouveaux comptes nécessitent une validation manuelle
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-yellow-600">
                  Voir les détails →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;