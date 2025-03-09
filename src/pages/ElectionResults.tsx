import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getElectionResults } from "@/api/candidates";
import { toast } from "sonner";
import { Candidate } from "@/config/candidates";

type ElectionResults = {
  candidates: (Candidate & { percentage: number })[];
  totalVotes: number;
  turnoutPercentage: number;
};

const ElectionResults = () => {
  const [results, setResults] = useState<ElectionResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setIsLoading(true);
        const data = await getElectionResults();
        setResults(data);
      } catch (error) {
        console.error("Failed to load election results:", error);
        toast.error("Failed to load election results");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResults();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Loading Results...</h1>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">No results available</h1>
      </div>
    );
  }

  // Sort candidates by votes
  const sortedCandidates = [...results.candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Election Results</h1>
        <div className="flex justify-center items-center gap-2">
          <Badge
            variant="outline"
            className={`${
              results.totalVotes > 0 
                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" 
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
            }`}
          >
            {results.totalVotes > 0 ? "Votes Recorded" : "No Votes Yet"}
          </Badge>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Votes Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{results.totalVotes.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Leading Candidate</CardTitle>
          </CardHeader>
          <CardContent>
            {winner && results.totalVotes > 0 ? (
              <>
                <p className="text-xl font-bold">{winner.name}</p>
                <p className="text-sm text-muted-foreground">{winner.party}</p>
                <p className="text-sm text-muted-foreground">{winner.percentage.toFixed(1)}% of votes</p>
              </>
            ) : (
              <p className="text-lg">No votes cast yet</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Voter Turnout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{results.turnoutPercentage.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
            <CardDescription>Breakdown of votes per candidate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {results.totalVotes > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedCandidates}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value.toLocaleString()} votes`, 
                        props.payload.party
                      ]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="votes" 
                      name="Votes" 
                      radius={[4, 4, 0, 0]}
                    >
                      {sortedCandidates.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#6b7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-gray-500">No votes cast yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vote Share</CardTitle>
            <CardDescription>Percentage distribution of votes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {results.totalVotes > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sortedCandidates}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="votes"
                      nameKey="name"
                      label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    >
                      {sortedCandidates.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#6b7280'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value.toLocaleString()} votes (${props.payload.percentage.toFixed(1)}%)`,
                        props.payload.party
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-gray-500">No votes cast yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>Complete breakdown of all candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Candidate</th>
                  <th className="text-left py-3 px-4">Party</th>
                  <th className="text-right py-3 px-4">Votes</th>
                  <th className="text-right py-3 px-4">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {sortedCandidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b">
                    <td className="py-3 px-4">{candidate.name}</td>
                    <td className="py-3 px-4">{candidate.party}</td>
                    <td className="text-right py-3 px-4">{candidate.votes.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{candidate.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectionResults;
