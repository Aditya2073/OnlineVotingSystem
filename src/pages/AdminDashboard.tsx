import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { getCandidates } from "@/api/candidates";
import { getElectionResults, getRegionalData } from "@/api/votes";
import { Candidate } from "@/config/candidates";
import { clientUpdateCandidate } from "@/api/clientApi";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [electionActive, setElectionActive] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for statistics
  const votingStats = [
    { name: "Total Registered Voters", value: 12500 },
    { name: "Votes Cast", value: results?.totalVotes || 0 },
    { name: "Pending Voters", value: 12500 - (results?.totalVotes || 0) },
    { name: "Voter Turnout", value: `${results?.turnoutPercentage || 0}%` },
  ];

  const COLORS = ["#1a365d", "#ff9933", "#138808", "#9333ea"];

  // Mock recent voters
  const recentVoters = [
    { id: "V12345", name: "Ananya Desai", time: "10:45 AM", booth: "Booth #5" },
    { id: "V12346", name: "Vikram Singh", time: "10:42 AM", booth: "Booth #3" },
    { id: "V12347", name: "Meera Joshi", time: "10:38 AM", booth: "Booth #1" },
    { id: "V12348", name: "Arjun Reddy", time: "10:35 AM", booth: "Booth #2" },
    { id: "V12349", name: "Kavita Sharma", time: "10:30 AM", booth: "Booth #4" },
  ];

  useEffect(() => {
    // Check if user is admin
    if (user && !user.isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load candidates
        const candidatesData = await getCandidates();
        setCandidates(candidatesData);
        
        // Load results
        const resultsData = await getElectionResults();
        setResults(resultsData);
        
        // Load regional data
        const regionsData = await getRegionalData();
        setRegionalData(regionsData);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, navigate]);

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate({...candidate});
    setIsDialogOpen(true);
  };

  const handleSaveCandidate = async () => {
    if (!editingCandidate) return;
    
    try {
      await clientUpdateCandidate(editingCandidate.id, editingCandidate);
      
      // Update local state
      setCandidates(candidates.map(c => 
        c.id === editingCandidate.id ? editingCandidate : c
      ));
      
      toast.success("Candidate updated successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update candidate:", error);
      toast.error("Failed to update candidate");
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (!editingCandidate) return;
    
    setEditingCandidate({
      ...editingCandidate,
      [field]: value
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Loading dashboard data...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-20" />
            </Card>
          ))}
        </div>
        <Card className="mb-8">
          <Skeleton className="h-[300px] w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage elections and monitor voting statistics
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="election-status"
              checked={electionActive}
              onCheckedChange={setElectionActive}
            />
            <Label htmlFor="election-status">
              Election {electionActive ? "Active" : "Inactive"}
            </Label>
          </div>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {votingStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="results" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="results">Election Results</TabsTrigger>
          <TabsTrigger value="candidates">Manage Candidates</TabsTrigger>
          <TabsTrigger value="voters">Recent Voters</TabsTrigger>
          <TabsTrigger value="regions">Regional Data</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Current Election Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Vote Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={results?.candidates || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#1a365d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Percentage Share</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={results?.candidates || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="votes"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {results?.candidates.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Candidates</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>{candidate.id}</TableCell>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.party}</TableCell>
                      <TableCell>{candidate.votes}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCandidate(candidate)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="voters">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Voters</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voter ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Booth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentVoters.map((voter) => (
                    <TableRow key={voter.id}>
                      <TableCell>{voter.id}</TableCell>
                      <TableCell className="font-medium">{voter.name}</TableCell>
                      <TableCell>{voter.time}</TableCell>
                      <TableCell>{voter.booth}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Regional Voting Data</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Turnout (%)</TableHead>
                    <TableHead>Leading Candidate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionalData.map((region) => (
                    <TableRow key={region.region}>
                      <TableCell className="font-medium">{region.region}</TableCell>
                      <TableCell>{region.turnout}%</TableCell>
                      <TableCell>{region.winner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Candidate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Update candidate information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingCandidate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingCandidate.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="party" className="text-right">
                  Party
                </Label>
                <Input
                  id="party"
                  value={editingCandidate.party}
                  onChange={(e) => handleInputChange('party', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input
                  id="bio"
                  value={editingCandidate.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={editingCandidate.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={editingCandidate.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCandidate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
