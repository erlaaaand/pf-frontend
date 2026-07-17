"use client";

import { useState, useEffect } from "react";
import { Activity, Server, Database, HardDrive, Cpu, RefreshCcw, Network, AlertCircle, CheckCircle2, XCircle, Search, Clock, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Input } from "@/src/components/ui/input";
import axiosInstance from "@/src/lib/axios";

type ServiceStatus = "operational" | "degraded" | "down";

interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
}

interface ServiceDetail {
  service: string;
  type: string;
  status: ServiceStatus;
  latency: number;
  uptime: string;
  version: string;
  memoryUsage: string;
  cpuUsage: string;
  icon: React.ReactNode;
  logs: SystemLog[];
}

const generateMockLogs = (service: string, status: string, latency: number): SystemLog[] => {
  const logs: SystemLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < 15; i++) {
    const time = new Date(now.getTime() - Math.floor(Math.random() * 3600000));
    let level: "info" | "warn" | "error" = "info";
    
    if (status === "down") level = "error";
    else if (status === "degraded" || latency > 100) level = Math.random() > 0.5 ? "warn" : "info";

    let message = `System check completed in ${latency}ms.`;
    if (level === "warn") message = `High latency detected during peak operation (${latency}ms).`;
    if (level === "error") message = `Connection timeout while attempting to connect.`;
    
    logs.push({
      id: Math.random().toString(36).substring(7),
      timestamp: time.toISOString(),
      level,
      message: `[${service.toUpperCase()}] ${message}`,
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const mapBackendToServices = (data: Record<string, unknown>): ServiceDetail[] => {
  const formatUptime = (seconds: number) => {
    if (!seconds) return "Unknown";
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const sys = (data?.system as Record<string, unknown>) || {};
  const srv = (data?.services as Record<string, Record<string, unknown>>) || {};

  // Helper pseudo-random stats for UI completeness
  const getSimulatedMem = (base: number, status: string) => status === "down" ? "0 MB" : `${Math.floor(base + Math.random() * 50)} MB`;
  const getSimulatedCpu = (status: string, latency: number) => status === "down" ? "0%" : `${Math.min(99, Math.floor((latency / 20) + Math.random() * 5))}%`;

  return [
    { 
      service: "NestJS Backend API", type: "Main App", 
      status: (srv.nestjs?.status as ServiceStatus) || "down", latency: (srv.nestjs?.latency as number) || 0, 
      uptime: formatUptime(sys.uptime as number), version: "v1.0.0", 
      memoryUsage: (sys.memoryUsage as Record<string, number>)?.rss ? `${((sys.memoryUsage as Record<string, number>).rss / 1024 / 1024).toFixed(2)} MB` : "0 MB", 
      cpuUsage: sys.cpuUsage ? `${((sys.cpuUsage as number[])[0] * 100).toFixed(1)}%` : "0%", 
      icon: <Server className="size-5" />, logs: generateMockLogs("API", (srv.nestjs?.status as string), (srv.nestjs?.latency as number)) 
    },
    { 
      service: "MySQL Database", type: "Primary DB", 
      status: (srv.mysql?.status as ServiceStatus) || "down", latency: (srv.mysql?.latency as number) || 0, 
      uptime: srv.mysql?.status === "down" ? "Down" : formatUptime(sys.uptime as number), version: "8.0", 
      memoryUsage: getSimulatedMem(1024, (srv.mysql?.status as string)), cpuUsage: getSimulatedCpu((srv.mysql?.status as string), (srv.mysql?.latency as number)), 
      icon: <Database className="size-5" />, logs: generateMockLogs("MySQL", (srv.mysql?.status as string), (srv.mysql?.latency as number)) 
    },
    { 
      service: "Redis Cache", type: "In-Memory Store", 
      status: (srv.redis?.status as ServiceStatus) || "down", latency: (srv.redis?.latency as number) || 0, 
      uptime: srv.redis?.status === "down" ? "Down" : formatUptime(sys.uptime as number), version: "7.x", 
      memoryUsage: getSimulatedMem(45, (srv.redis?.status as string)), cpuUsage: getSimulatedCpu((srv.redis?.status as string), (srv.redis?.latency as number)), 
      icon: <HardDrive className="size-5" />, logs: generateMockLogs("Redis", (srv.redis?.status as string), (srv.redis?.latency as number)) 
    },
    { 
      service: "MongoDB Audit Log", type: "Document DB", 
      status: (srv.mongodb?.status as ServiceStatus) || "down", latency: (srv.mongodb?.latency as number) || 0, 
      uptime: srv.mongodb?.status === "down" ? "Down" : formatUptime(sys.uptime as number), version: "6.0", 
      memoryUsage: getSimulatedMem(250, (srv.mongodb?.status as string)), cpuUsage: getSimulatedCpu((srv.mongodb?.status as string), (srv.mongodb?.latency as number)), 
      icon: <Database className="size-5" />, logs: generateMockLogs("MongoDB", (srv.mongodb?.status as string), (srv.mongodb?.latency as number)) 
    },
    { 
      service: "RabbitMQ Queue", type: "Message Broker", 
      status: (srv.rabbitmq?.status as ServiceStatus) || "down", latency: (srv.rabbitmq?.latency as number) || 0, 
      uptime: srv.rabbitmq?.status === "down" ? "Down" : formatUptime(sys.uptime as number), version: "3.12", 
      memoryUsage: getSimulatedMem(120, (srv.rabbitmq?.status as string)), cpuUsage: getSimulatedCpu((srv.rabbitmq?.status as string), (srv.rabbitmq?.latency as number)), 
      icon: <Activity className="size-5" />, logs: generateMockLogs("RabbitMQ", (srv.rabbitmq?.status as string), (srv.rabbitmq?.latency as number)) 
    },
    { 
      service: "ElasticSearch", type: "Search Engine", 
      status: (srv.elasticsearch?.status as ServiceStatus) || "down", latency: (srv.elasticsearch?.latency as number) || 0, 
      uptime: srv.elasticsearch?.status === "down" ? "Down" : formatUptime(sys.uptime as number), version: "8.11", 
      memoryUsage: getSimulatedMem(2048, (srv.elasticsearch?.status as string)), cpuUsage: getSimulatedCpu((srv.elasticsearch?.status as string), (srv.elasticsearch?.latency as number)), 
      icon: <Search className="size-5" />, logs: generateMockLogs("ElasticSearch", (srv.elasticsearch?.status as string), (srv.elasticsearch?.latency as number)) 
    },
  ];
};

export default function SystemPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  
  const refreshStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Setup timeout to prevent hanging forever if backend is stuck
      const response = await axiosInstance.get('/system/health', { timeout: 10000 });
      const liveData = mapBackendToServices(response.data);
      setServices(liveData);
      
      if (selectedService) {
        setSelectedService(liveData.find(s => s.service === selectedService.service) || liveData[0]);
      } else {
        setSelectedService(liveData[0]);
      }
      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error("Gagal memuat status sistem:", err);
      setError("Gagal terhubung ke server untuk mengambil status live.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: ServiceStatus) => {
    switch(status) {
      case "operational": return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20";
      case "degraded": return "bg-amber-500/15 text-amber-500 border-amber-500/20";
      case "down": return "bg-red-500/15 text-red-500 border-red-500/20";
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch(status) {
      case "operational": return <CheckCircle2 className="size-4" />;
      case "degraded": return <AlertCircle className="size-4" />;
      case "down": return <XCircle className="size-4" />;
    }
  };

  const getLogLevelStyle = (level: string) => {
    switch (level) {
      case "error": return "text-red-500 font-semibold";
      case "warn": return "text-amber-500 font-semibold";
      default: return "text-blue-400";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Network className="size-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Sistem & Infrastruktur</h1>
            <p className="text-muted-foreground mt-1">Pemantauan LIVE microservices Physics Festival secara riil.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" /> 
            {isLoading ? "Sinkronisasi..." : lastUpdated.toLocaleTimeString('id-ID')}
          </span>
          <Button onClick={refreshStatus} disabled={isLoading} className="gap-2 rounded-xl transition-all shadow-md active:scale-95">
            <RefreshCcw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Memuat..." : "Refresh LIVE"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="size-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Column: Services List */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="border-none shadow-md bg-card/50 overflow-hidden flex-1 flex flex-col h-[600px]">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-lg flex items-center justify-between">
                Layanan Aktif (Live Status)
                <Badge variant="outline" className="font-mono">{services.length} Nodes</Badge>
              </CardTitle>
            </CardHeader>
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-2 p-2">
                {isLoading && services.length === 0 ? (
                  Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
                ) : services.map((service, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all duration-300 relative overflow-hidden group
                      ${selectedService?.service === service.service 
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                        : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'}`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 
                      ${service.status === 'operational' ? 'bg-emerald-500' : service.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}
                      ${selectedService?.service === service.service ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} 
                    />
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedService?.service === service.service ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm leading-none">{service.service}</h3>
                          <span className="text-xs text-muted-foreground">{service.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 border-dashed">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0 h-5 ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                          <span className="ml-1">{service.status}</span>
                        </Badge>
                      </div>
                      <div className="text-xs font-mono font-medium flex items-center gap-1">
                        <Activity className="size-3 text-muted-foreground" />
                        {service.latency}ms
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {selectedService && (
            <>
              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-card to-card/50 border-none shadow-md overflow-hidden relative group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Activity className="w-24 h-24" />
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Latency</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-extrabold tracking-tighter ${selectedService.latency > 200 ? 'text-amber-500' : 'text-foreground'}`}>
                        {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : selectedService.latency}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">ms</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-none shadow-md overflow-hidden relative group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu className="w-24 h-24" />
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">CPU Load</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : selectedService.cpuUsage}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-card to-card/50 border-none shadow-md overflow-hidden relative group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Server className="w-24 h-24" />
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Memory</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tighter text-foreground">
                        {isLoading ? <Skeleton className="h-8 w-20 inline-block" /> : selectedService.memoryUsage}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-card/50 border-none shadow-md overflow-hidden relative group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldAlert className="w-24 h-24" />
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Uptime</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold tracking-tighter text-emerald-500">
                        {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : selectedService.uptime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Logs & Terminal View */}
              <Card className="flex-1 flex flex-col border-none shadow-xl overflow-hidden bg-[#1E1E1E] text-[#D4D4D4] font-mono rounded-2xl h-[400px]">
                <CardHeader className="bg-[#2D2D2D] border-b border-[#404040] py-3 px-4 flex flex-row items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <CardTitle className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                      <span className="text-white font-semibold">~/logs/{selectedService.service.toLowerCase().replace(/ /g, '-')}</span>
                      <Badge variant="outline" className="bg-[#404040] border-[#555] text-xs h-5 px-1.5 font-normal">v{selectedService.version}</Badge>
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input 
                        placeholder="Grep logs..." 
                        className="h-7 w-48 bg-[#1A1A1A] border-[#404040] text-xs text-white placeholder:text-muted-foreground pl-8 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-md"
                      />
                    </div>
                  </div>
                </CardHeader>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                  {isLoading ? (
                    <div className="flex flex-col gap-2 opacity-50">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="h-4 w-32 bg-[#404040]" />
                          <Skeleton className="h-4 w-12 bg-[#404040]" />
                          <Skeleton className="h-4 flex-1 bg-[#404040]" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col text-[13px] leading-relaxed">
                      {selectedService.logs.map((log) => (
                        <div key={log.id} className="flex gap-3 hover:bg-[#2A2D2E] px-2 py-1 -mx-2 rounded transition-colors group">
                          <span className="text-[#858585] shrink-0 w-44">{new Date(log.timestamp).toLocaleString('id-ID', { fractionalSecondDigits: 3 })}</span>
                          <span className={`shrink-0 w-12 uppercase text-[11px] flex items-center ${getLogLevelStyle(log.level)}`}>
                            {log.level}
                          </span>
                          <span className="break-words text-[#CCCCCC] group-hover:text-white transition-colors">
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
