import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowUpRight, AlertCircle, TrendingUp, ShieldAlert, Activity, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Updated sample data with year and month
const loanData = [
  { month: 'Jan 2024', disbursed: 10000000, utilized: 8000000 },
  { month: 'Feb 2024', disbursed: 15000000, utilized: 12000000 },
  { month: 'Mar 2024', disbursed: 20000000, utilized: 18000000 },
  { month: 'Apr 2024', disbursed: 18000000, utilized: 17000000 },
  { month: 'May 2024', disbursed: 22000000, utilized: 19000000 },
];

const customerSegments = [
  { 
    id: 1, 
    name: "Bharat Technologies Solutions", 
    compliance: "High", 
    risk: "Low", 
    utilizationRate: "92%",
    behavioralScore: "Good",
    patterns: {
      loanMisuse: "No patterns detected",
      fraudRisk: "Low",
      fundDiversion: "None",
      alerts: 0
    },
    transactions: {
      debit: [
        { 
          date: "2024-03-01", 
          amount: 5000000,
          category: "Equipment", 
          paymentMethod: "RTGS",
          flag: false,
          year: 2024,
          month: "March"
        },
        { 
          date: "2024-03-10", 
          amount: 2000000,
          category: "Operations", 
          paymentMethod: "NEFT",
          flag: false,
          year: 2024,
          month: "March"
        },
      ],
      credit: [
        { 
          date: "2024-03-05", 
          amount: 3000000,
          category: "Repayment", 
          paymentMethod: "Cheque",
          flag: false,
          year: 2024,
          month: "March"
        }
      ]
    }
  },
  { 
    id: 2, 
    name: "IndiaGrowth Enterprises", 
    compliance: "Medium", 
    risk: "Medium", 
    utilizationRate: "78%",
    behavioralScore: "Needs Monitoring",
    patterns: {
      loanMisuse: "Occasional personal use detected",
      fraudRisk: "Medium",
      fundDiversion: "Some instances",
      alerts: 3
    },
    transactions: {
      debit: [
        { 
          date: "2024-02-02", 
          amount: 4000000,
          category: "Inventory", 
          paymentMethod: "Cash",
          flag: true,
          year: 2024,
          month: "February"
        },
        { 
          date: "2024-02-12", 
          amount: 3500000,
          category: "Equipment", 
          paymentMethod: "RTGS",
          flag: false,
          year: 2024,
          month: "February"
        },
      ],
      credit: [
        { 
          date: "2024-02-07", 
          amount: 2500000,
          category: "Unknown", 
          paymentMethod: "Cheque",
          flag: true,
          year: 2024,
          month: "February"
        }
      ]
    }
  },
  { 
    id: 3, 
    name: "Desi Digital Services", 
    compliance: "Low", 
    risk: "High", 
    utilizationRate: "65%",
    behavioralScore: "Critical",
    patterns: {
      loanMisuse: "Frequent misuse detected",
      fraudRisk: "High",
      fundDiversion: "Multiple instances",
      alerts: 7
    },
    transactions: {
      debit: [
        { 
          date: "2024-01-03", 
          amount: 6000000,
          category: "Unknown", 
          paymentMethod: "Cash",
          flag: true,
          year: 2024,
          month: "January"
        },
        { 
          date: "2024-01-13", 
          amount: 1500000,
          category: "Operations", 
          paymentMethod: "NEFT",
          flag: false,
          year: 2024,
          month: "January"
        },
      ],
      credit: [
        { 
          date: "2024-01-08", 
          amount: 4500000,
          category: "Real Estate", 
          paymentMethod: "RTGS",
          flag: true,
          year: 2024,
          month: "January"
        }
      ]
    }
  },
];

const formatIndianCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const calculateAggregations = () => {
  // Calculate transaction aggregations separated by debit and credit
  const transactionAggregations = customerSegments.reduce((acc, customer) => {
    // Initialize structure if not exists
    if (!acc.debit) {
      acc.debit = {
        RTGS: { count: 0, totalAmount: 0 },
        Cash: { count: 0, totalAmount: 0 },
        Cheque: { count: 0, totalAmount: 0 },
        NEFT: { count: 0, totalAmount: 0 }
      };
    }
    if (!acc.credit) {
      acc.credit = {
        RTGS: { count: 0, totalAmount: 0 },
        Cash: { count: 0, totalAmount: 0 },
        Cheque: { count: 0, totalAmount: 0 },
        NEFT: { count: 0, totalAmount: 0 }
      };
    }
    
    // Aggregate debit transactions
    customer.transactions.debit.forEach(transaction => {
      acc.debit[transaction.paymentMethod].count += 1;
      acc.debit[transaction.paymentMethod].totalAmount += transaction.amount;
    });
    
    // Aggregate credit transactions
    customer.transactions.credit.forEach(transaction => {
      acc.credit[transaction.paymentMethod].count += 1;
      acc.credit[transaction.paymentMethod].totalAmount += transaction.amount;
    });
    
    return acc;
  }, { debit: {}, credit: {} } as Record<'debit' | 'credit', Record<string, { count: number; totalAmount: number }>>);

  const totalDisbursed = loanData.reduce((sum, item) => sum + item.disbursed, 0);
  const totalUtilized = loanData.reduce((sum, item) => sum + item.utilized, 0);
  const avgUtilizationRate = (totalUtilized / totalDisbursed * 100).toFixed(1);
  
  return {
    totalDisbursed,
    totalUtilized,
    avgUtilizationRate,
    transactionAggregations
  };
};

const calculateCustomerTransactionAggregations = (customer: typeof customerSegments[0]) => {
  const aggregations = {
    debit: {
      RTGS: { count: 0, totalAmount: 0 },
      Cash: { count: 0, totalAmount: 0 },
      Cheque: { count: 0, totalAmount: 0 },
      NEFT: { count: 0, totalAmount: 0 }
    },
    credit: {
      RTGS: { count: 0, totalAmount: 0 },
      Cash: { count: 0, totalAmount: 0 },
      Cheque: { count: 0, totalAmount: 0 },
      NEFT: { count: 0, totalAmount: 0 }
    }
  };

  // Aggregate debit transactions
  customer.transactions.debit.forEach(transaction => {
    aggregations.debit[transaction.paymentMethod].count += 1;
    aggregations.debit[transaction.paymentMethod].totalAmount += transaction.amount;
  });

  // Aggregate credit transactions
  customer.transactions.credit.forEach(transaction => {
    aggregations.credit[transaction.paymentMethod].count += 1;
    aggregations.credit[transaction.paymentMethod].totalAmount += transaction.amount;
  });

  return aggregations;
};

const Index = () => {
  console.log("Rendering Janakalyan Bank loan monitoring dashboard");
  
  const aggregations = calculateAggregations();
  
  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-slate-50 to-white">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-white border-2 border-orange-200 flex items-center justify-center p-1">
          <img
            src="/lovable-uploads/0473091d-142b-4ba1-86f8-14a9e67da0d6.png"
            alt="Janakalyan Bank Logo"
            className="w-14 h-14 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Janakalyan Bank - Loan Monitoring Dashboard
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-blue-100 shadow-lg hover:border-blue-200 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-800">Total Disbursement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatIndianCurrency(85000000)}</div>
            <p className="text-xs text-blue-600">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-emerald-100 shadow-lg hover:border-emerald-200 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
              Utilization Rate
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-emerald-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Utilization Rate measures how effectively loan funds are being used:</p>
                    <ul className="list-disc ml-4 mt-1">
                      <li>Actual funds used vs. sanctioned amount</li>
                      <li>Speed of fund deployment</li>
                      <li>Purpose alignment</li>
                      <li>Seasonal variations</li>
                      <li>Industry benchmarks</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">87%</div>
            <p className="text-xs text-emerald-600">Average across all accounts</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-amber-100 shadow-lg hover:border-amber-200 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
              Risk Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-amber-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Risk Score indicates the overall lending risk based on:</p>
                    <ul className="list-disc ml-4 mt-1">
                      <li>Payment history</li>
                      <li>Fund utilization patterns</li>
                      <li>Transaction behavior</li>
                      <li>Compliance adherence</li>
                      <li>Market sector performance</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">Medium</div>
            <p className="text-xs text-amber-600">Based on current patterns</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 shadow-lg hover:border-purple-200 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-purple-800">Active Loan Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">127</div>
            <p className="text-xs text-purple-600">+3 new this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="border-2 border-indigo-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-indigo-800">Transaction Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Debit Transactions */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-indigo-700">Debit Transactions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border border-orange-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-orange-800">Cash Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-orange-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.debit.Cash.totalAmount)}
                      </div>
                      <p className="text-xs text-orange-600">Count: {aggregations.transactionAggregations.debit.Cash.count}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-blue-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-800">RTGS Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-blue-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.debit.RTGS.totalAmount)}
                      </div>
                      <p className="text-xs text-blue-600">Count: {aggregations.transactionAggregations.debit.RTGS.count}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-purple-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-purple-800">Cheque Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-purple-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.debit.Cheque.totalAmount)}
                      </div>
                      <p className="text-xs text-purple-600">Count: {aggregations.transactionAggregations.debit.Cheque.count}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-emerald-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-emerald-800">NEFT Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-emerald-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.debit.NEFT.totalAmount)}
                      </div>
                      <p className="text-xs text-emerald-600">Count: {aggregations.transactionAggregations.debit.NEFT.count}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Credit Transactions */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-indigo-700">Credit Transactions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border border-orange-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-orange-800">Cash Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-orange-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.credit.Cash.totalAmount)}
                      </div>
                      <p className="text-xs text-orange-600">Count: {aggregations.transactionAggregations.credit.Cash.count}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-blue-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-blue-800">RTGS Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-blue-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.credit.RTGS.totalAmount)}
                      </div>
                      <p className="text-xs text-blue-600">Count: {aggregations.transactionAggregations.credit.RTGS.count}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-purple-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-purple-800">Cheque Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-purple-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.credit.Cheque.totalAmount)}
                      </div>
                      <p className="text-xs text-purple-600">Count: {aggregations.transactionAggregations.credit.Cheque.count}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-emerald-100">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-emerald-800">NEFT Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-emerald-900">
                        {formatIndianCurrency(aggregations.transactionAggregations.credit.NEFT.totalAmount)}
                      </div>
                      <p className="text-xs text-emerald-600">Count: {aggregations.transactionAggregations.credit.NEFT.count}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="utilization" className="space-y-4">
        <TabsList className="bg-white border-2 border-gray-100 p-1">
          <TabsTrigger value="utilization" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900">
            Utilization Patterns
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900">
            Compliance Analysis
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900">
            Behavioral Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="utilization">
          <Card className="border-2 border-gray-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Loan Disbursement vs Utilization (2024)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]" config={{
                disbursed: { color: "#1a365d" },
                utilized: { color: "#059669" }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={loanData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(Number(value) / 10000000).toFixed(1)}Cr`} />
                    <ChartTooltip formatter={(value: number) => formatIndianCurrency(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="disbursed" 
                      stroke="#1a365d" 
                      name="Disbursed Amount" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="utilized" 
                      stroke="#059669" 
                      name="Utilized Amount" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card className="border-2 border-gray-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Customer Compliance Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-700">Compliance Level</TableHead>
                    <TableHead className="font-semibold text-gray-700">Risk Level</TableHead>
                    <TableHead className="font-semibold text-gray-700">Utilization Rate</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSegments.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${
                          customer.compliance === "High" 
                            ? "bg-green-50 text-green-800 border-green-200" 
                            : customer.compliance === "Medium"
                            ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}>
                          {customer.compliance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${
                          customer.risk === "Low" 
                            ? "bg-green-50 text-green-800 border-green-200" 
                            : customer.risk === "Medium"
                            ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}>
                          {customer.risk}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900">{customer.utilizationRate}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {customer.name} - Transaction Analysis
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Debit Transactions</h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Year</TableHead>
                                      <TableHead>Month</TableHead>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Category</TableHead>
                                      <TableHead>Payment Method</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {customer.transactions.debit.map((transaction, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.year}</TableCell>
                                        <TableCell>{transaction.month}</TableCell>
                                        <TableCell>{formatIndianCurrency(transaction.amount)}</TableCell>
                                        <TableCell>{transaction.category}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline" className={
                                            transaction.paymentMethod === "Cash" 
                                              ? "bg-orange-50 text-orange-800 border-orange-200"
                                              : transaction.paymentMethod === "RTGS" || transaction.paymentMethod === "NEFT"
                                              ? "bg-blue-50 text-blue-800 border-blue-200"
                                              : "bg-purple-50 text-purple-800 border-purple-200"
                                          }>
                                            {transaction.paymentMethod}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {transaction.flag ? (
                                            <div className="flex items-center text-destructive gap-1">
                                              <AlertTriangle className="h-4 w-4" />
                                              <span>Flagged</span>
                                            </div>
                                          ) : (
                                            <span className="text-green-600">Normal</span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Credit Transactions</h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Year</TableHead>
                                      <TableHead>Month</TableHead>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Category</TableHead>
                                      <TableHead>Payment Method</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {customer.transactions.credit.map((transaction, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.year}</TableCell>
                                        <TableCell>{transaction.month}</TableCell>
                                        <TableCell>{formatIndianCurrency(transaction.amount)}</TableCell>
                                        <TableCell>{transaction.category}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline" className={
                                            transaction.paymentMethod === "Cash" 
                                              ? "bg-orange-50 text-orange-800 border-orange-200"
                                              : transaction.paymentMethod === "RTGS" || transaction.paymentMethod === "NEFT"
                                              ? "bg-blue-50 text-blue-800 border-blue-200"
                                              : "bg-purple-50 text-purple-800 border-purple-200"
                                          }>
                                            {transaction.paymentMethod}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {transaction.flag ? (
                                            <div className="flex items-center text-destructive gap-1">
                                              <AlertTriangle className="h-4 w-4" />
                                              <span>Flagged</span>
                                            </div>
                                          ) : (
                                            <span className="text-green-600">Normal</span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card className="border-2 border-gray-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Behavioral Monitoring & Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {customerSegments.map((customer) => (
                  <Card key={customer.id} className={`border-l-4 ${
                    customer.behavioralScore === "Good" 
                      ? "border-l-green-500" 
                      : customer.behavioralScore === "Needs Monitoring"
                      ? "border-l-yellow-500"
                      : "border-l-red-500"
                  } p-4`}>
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{customer.name}</h3>
                        <Badge variant="outline" className={`${
                          customer.behavioralScore === "Good" 
                            ? "bg-green-50 text-green-800 border-green-200" 
                            : customer.behavioralScore === "Needs Monitoring"
                            ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}>
                          {customer.behavioralScore}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Loan Misuse</p>
                            <p className="text-sm text-gray-600">{customer.patterns.loanMisuse}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium">Fraud Risk</p>
                            <p className="text-sm text-gray-600">{customer.patterns.fraudRisk}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-5 w-5 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium">Fund Diversion</p>
                            <p className="text-sm text-gray-600">{customer.patterns.fundDiversion}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Activity className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium">Active Alerts</p>
                            <p className="text-sm text-gray-600">{customer.patterns.alerts} alerts</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
