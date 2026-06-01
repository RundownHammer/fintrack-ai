"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  ExternalLink,
  Star,
  TrendingUp,
  TrendingDown,
  Filter,
  Clock,
  AlertTriangle,
  FileText,
  Send,
} from "lucide-react";

const customers = [
  {
    id: 1,
    name: "Acme Corporation",
    industry: "Technology",
    billingStatus: "Active",
    location: "San Francisco, CA",
    contact: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    gstin: "18AABCT1234H1Z0",
    totalBilled: 485000,
    unpaidInvoices: 1,
    currentBalance: 45000,
    paymentReliability: 95,
  },
  {
    id: 2,
    name: "GlobalTech Industries",
    industry: "Manufacturing",
    billingStatus: "Active",
    location: "New York, NY",
    contact: "Sarah Johnson",
    email: "sarah@globaltech.com",
    phone: "+1 (555) 234-5678",
    gstin: "27AABCT5678H2Z0",
    totalBilled: 320000,
    unpaidInvoices: 0,
    currentBalance: 0,
    paymentReliability: 98,
  },
  {
    id: 3,
    name: "Innovate Labs",
    industry: "Healthcare",
    billingStatus: "Overdue Balance",
    location: "Boston, MA",
    contact: "Michael Chen",
    email: "michael@innovatelabs.com",
    phone: "+1 (555) 345-6789",
    gstin: "09AABCT9012H3Z0",
    totalBilled: 156000,
    unpaidInvoices: 3,
    currentBalance: 78000,
    paymentReliability: 65,
  },
  {
    id: 4,
    name: "DataStream Analytics",
    industry: "Data Services",
    billingStatus: "Active",
    location: "Austin, TX",
    contact: "Emily Rodriguez",
    email: "emily@datastream.com",
    phone: "+1 (555) 456-7890",
    gstin: "07AABCT3456H4Z0",
    totalBilled: 98000,
    unpaidInvoices: 2,
    currentBalance: 32000,
    paymentReliability: 72,
  },
  {
    id: 5,
    name: "NextGen Solutions",
    industry: "Finance",
    billingStatus: "Inactive",
    location: "Chicago, IL",
    contact: "David Park",
    email: "david@nextgen.com",
    phone: "+1 (555) 567-8901",
    gstin: "20AABCT7890H5Z0",
    totalBilled: 45000,
    unpaidInvoices: 5,
    currentBalance: 45000,
    paymentReliability: 42,
  },
  {
    id: 6,
    name: "CloudFirst Inc",
    industry: "Cloud Services",
    billingStatus: "Active",
    location: "Seattle, WA",
    contact: "Lisa Wang",
    email: "lisa@cloudfirst.com",
    phone: "+1 (555) 678-9012",
    gstin: "29AABCT2345H6Z0",
    totalBilled: 275000,
    unpaidInvoices: 0,
    currentBalance: 0,
    paymentReliability: 99,
  },
];

const billingStatusColors: Record<string, string> = {
  Active: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  "Overdue Balance": "bg-destructive/20 text-destructive border-destructive/30",
  Inactive: "bg-muted text-muted-foreground border-border",
};

export function CustomersSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.gstin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || customer.billingStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = customers.reduce((acc, c) => acc + c.totalRevenue, 0);
  const avgDaysToPay = 14; // Calculated average days to pay
  const outstandingBalance = customers.reduce((acc, c) => acc + c.totalRevenue * 0.15, 0); // 15% of LTV as outstanding

  return (
    <div className="space-y-6">
      {/* Page subtitle */}
      <div>
        <p className="text-sm text-muted-foreground">Manage client billing profiles and payment health.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Active Clients",
            value: customers.length.toString(),
            icon: Building2,
            color: "text-foreground",
          },
          {
            label: "Total Lifetime Value (LTV)",
            value: `₹${(totalRevenue / 100000).toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: "text-accent",
          },
          {
            label: "Avg. Days to Pay",
            value: `${avgDaysToPay} Days`,
            icon: Clock,
            color: "text-chart-1",
          },
          {
            label: "Total Outstanding Balance",
            value: `₹${(outstandingBalance / 100000).toLocaleString('en-IN')}`,
            icon: AlertTriangle,
            color: "text-destructive",
          },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="border-border bg-card hover:border-muted-foreground/30 transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-semibold mt-1 ${stat.color}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name, email, or GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[380px] bg-secondary border-border focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {["All", "Active", "Overdue Balance", "Inactive"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(selectedStatus === status || status === "All" ? null : status)}
                className={selectedStatus === status ? "bg-accent text-accent-foreground" : ""}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCustomers.map((customer, index) => (
          <Card
            key={customer.id}
            className="border-border bg-card hover:border-accent/50 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 bg-secondary">
                    <AvatarFallback className="bg-secondary text-foreground font-semibold">
                      {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {customer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{customer.industry}</p>
                  </div>
                </div>
                <Badge className={`${billingStatusColors[customer.billingStatus]} border`}>
                  {customer.billingStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {customer.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-xs font-semibold text-foreground">GSTIN</span>
                    {customer.gstin}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Billed (LTV)</span>
                    <span className="font-medium text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                      ₹{customer.totalBilled.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Unpaid Invoices</span>
                    <span className="font-medium text-foreground">{customer.unpaidInvoices}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Balance</span>
                    <span className="font-medium text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                      ₹{customer.currentBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Reliability */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Payment Reliability</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${customer.paymentReliability}%`,
                        backgroundColor:
                          customer.paymentReliability >= 90
                            ? "rgb(34, 197, 94)"
                            : customer.paymentReliability >= 70
                            ? "rgb(34, 197, 94)"
                            : "rgb(239, 68, 68)",
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      customer.paymentReliability >= 90
                        ? "text-emerald-500"
                        : customer.paymentReliability >= 70
                        ? "text-emerald-500"
                        : "text-destructive"
                    }`}
                  >
                    {customer.paymentReliability}%
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  View Ledger
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Send Statement
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
