"use client";

import { useState } from "react";
import { Activity, Server, Database, Zap, Search, Play, Trash2, ShieldAlert, PlusCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import axiosInstance from "@/src/lib/axios";

interface InjectResult {
  insertTimeMs: number;
  mongoTimeMs: number;
  totalTimeMs: number;
  recordsProcessed: number;
  message: string;
  logs: string[];
}

interface SimulationResult {
  searchTimeMs: number;
  fetchTimeMs: number;
  totalTimeMs: number;
  cacheHit: boolean;
  message: string;
  logs: string[];
}

export default function SandboxPage() {
  const [dataCount, setDataCount] = useState<string>("1000");
  const [useRabbitMQ, setUseRabbitMQ] = useState<boolean>(true);
  const [useMongoDB, setUseMongoDB] = useState<boolean>(true);
  
  const [useRedis, setUseRedis] = useState<boolean>(true);
  const [useElasticSearch, setUseElasticSearch] = useState<boolean>(true);
  
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  
  const [injectResult, setInjectResult] = useState<InjectResult | null>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const handleInjectData = async () => {
    setIsInjecting(true);
    setInjectResult(null);
    try {
      const response = await axiosInstance.post("/simulation/inject", {
        dataCount: parseInt(dataCount, 10),
        useRabbitMQ,
        useMongoDB,
      });
      setInjectResult(response.data);
    } catch (error) {
      console.error("Injection failed:", error);
    } finally {
      setIsInjecting(false);
    }
  };

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setSimResult(null);
    try {
      const response = await axiosInstance.post("/simulation/run", {
        useRedis,
        useElasticSearch,
      });
      setSimResult(response.data);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      await axiosInstance.delete("/simulation/cleanup");
      setInjectResult(null);
      setSimResult(null);
    } catch (error) {
      console.error("Cleanup failed:", error);
    } finally {
      setIsCleaning(false);
    }
  };

  // Gabungkan log
  const allLogs = [
    ...(injectResult?.logs || []),
    ...(simResult?.logs || [])
  ];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 min-h-[calc(100vh-4rem)] bg-background/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Zap className="size-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Sandbox Simulasi</h1>
            <p className="text-muted-foreground mt-1">Uji coba ekosistem microservices dengan skenario beban tinggi terpisah (Write vs Read).</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="border shadow-lg">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                Parameter Injeksi (Tulis)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-sm">Volume Data (Dummy)</Label>
                <Select value={dataCount} onValueChange={(val) => setDataCount(val || "1000")}>
                  <SelectTrigger className="w-full h-12 rounded-xl">
                    <SelectValue placeholder="Pilih volume data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Data (Test Kecil)</SelectItem>
                    <SelectItem value="100">100 Data (Menengah)</SelectItem>
                    <SelectItem value="1000">1.000 Data (Tinggi)</SelectItem>
                    <SelectItem value="10000">10.000 Data (Ekstrem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <Activity className="size-4 text-amber-500" />
                      RabbitMQ Queue
                    </span>
                    <span className="text-xs text-muted-foreground">Penyisipan event-driven asinkron.</span>
                  </div>
                  <Switch checked={useRabbitMQ} onCheckedChange={setUseRabbitMQ} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <ShieldAlert className="size-4 text-emerald-600" />
                      MongoDB Audit Log
                    </span>
                    <span className="text-xs text-muted-foreground">Catat aktivitas ke database NoSQL.</span>
                  </div>
                  <Switch checked={useMongoDB} onCheckedChange={setUseMongoDB} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 p-6 pt-0">
              <Button 
                onClick={handleInjectData} 
                disabled={isInjecting || isCleaning} 
                className="w-full h-12 rounded-xl text-md font-semibold gap-2 shadow-lg"
              >
                {isInjecting ? <RefreshCcw className="size-5 animate-spin" /> : <PlusCircle className="size-5" />}
                {isInjecting ? "Menyuntikkan..." : "Suntikkan Data"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border shadow-lg">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="size-5 text-primary" />
                Parameter Simulasi (Baca)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <Server className="size-4 text-emerald-500" />
                      Redis Cache
                    </span>
                    <span className="text-xs text-muted-foreground">Aktifkan caching in-memory.</span>
                  </div>
                  <Switch checked={useRedis} onCheckedChange={setUseRedis} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <Search className="size-4 text-blue-500" />
                      ElasticSearch
                    </span>
                    <span className="text-xs text-muted-foreground">Pencarian full-text (Fuzzy).</span>
                  </div>
                  <Switch checked={useElasticSearch} onCheckedChange={setUseElasticSearch} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 p-6 pt-0">
              <Button 
                onClick={handleRunSimulation} 
                disabled={isRunning || isCleaning || !injectResult} 
                variant="outline"
                className="w-full h-12 rounded-xl text-md font-semibold gap-2 shadow-lg border-primary text-primary hover:bg-primary/10"
              >
                {isRunning ? <RefreshCcw className="size-5 animate-spin" /> : <Play className="size-5" />}
                {isRunning ? "Membaca..." : "Mulai Simulasi Baca"}
              </Button>
            </CardFooter>
          </Card>

          <Button 
            onClick={handleCleanup} 
            disabled={isInjecting || isRunning || isCleaning} 
            variant="default" 
            className="w-full h-12 rounded-xl gap-2 shadow-md bg-red-500 hover:bg-red-600"
          >
            {isCleaning ? <RefreshCcw className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Bersihkan Seluruh Data
          </Button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="h-full border shadow-lg flex flex-col overflow-hidden bg-card/30">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg">Monitoring Eksekusi Live</CardTitle>
              <CardDescription>Pemisahan metrik performa tulis (injeksi) dan baca (simulasi).</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col gap-8">
              {!injectResult && !simResult && !isInjecting && !isRunning ? (
                <div className="flex-1 flex flex-col justify-center gap-6 p-2 lg:p-4 animate-in fade-in duration-700">
                  <div className="flex flex-col gap-3 p-5 bg-primary/5 rounded-2xl border border-primary/20">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                      <Search className="size-5" /> Mengapa Dipisah? (Tulis vs Baca)
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Proses <strong>Suntik Data (Tulis)</strong> kini dipisah dari <strong>Simulasi Baca</strong> agar Anda dapat mengamati bottleneck MySQL secara lebih detail, serta bisa menjalankan simulasi baca berulang-ulang pada kumpulan data yang sama untuk melihat efek Redis Cache HIT. Selain itu, <strong>MongoDB</strong> juga telah dilibatkan sebagai media Audit Log pendaftaran.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Tulis/Inject Results */}
                  {injectResult && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bold border-b pb-2 text-muted-foreground uppercase text-xs tracking-wider">Performa Tulis (Injeksi)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex flex-col p-4 rounded-xl border bg-card/80 shadow-sm items-center text-center justify-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Total Tulis</span>
                          <span className="text-3xl font-black text-primary">{injectResult.totalTimeMs}ms</span>
                        </div>
                        <div className="flex flex-col p-4 rounded-xl border bg-card/80 shadow-sm items-center text-center justify-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">MySQL Insert (Worker/Sync)</span>
                          <span className={`text-2xl font-bold ${injectResult.insertTimeMs > 1000 ? 'text-red-500' : 'text-emerald-500'}`}>{injectResult.insertTimeMs}ms</span>
                        </div>
                        <div className="flex flex-col p-4 rounded-xl border bg-card/80 shadow-sm items-center text-center justify-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">MongoDB Audit Log</span>
                          <span className={`text-2xl font-bold text-emerald-600`}>{injectResult.mongoTimeMs}ms</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Baca/Sim Results */}
                  {simResult && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bold border-b pb-2 text-muted-foreground uppercase text-xs tracking-wider">Performa Baca (Simulasi)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex flex-col p-4 rounded-xl border bg-card/80 shadow-sm items-center text-center justify-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Total Baca</span>
                          <span className="text-3xl font-black text-primary">{simResult.totalTimeMs}ms</span>
                        </div>
                        <div className="flex flex-col p-4 rounded-xl border bg-card/80 shadow-sm items-center text-center justify-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Fetch (Redis/MySQL)</span>
                          <span className={`text-2xl font-bold ${simResult.fetchTimeMs > 500 ? 'text-red-500' : 'text-emerald-500'}`}>{simResult.fetchTimeMs}ms</span>
                        </div>
                        <div className="flex flex-col p-4 rounded-xl border bg-card/80 shadow-sm items-center text-center justify-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Search (ES/MySQL)</span>
                          <span className={`text-2xl font-bold ${simResult.searchTimeMs > 200 ? 'text-amber-500' : 'text-emerald-500'}`}>{simResult.searchTimeMs}ms</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terminal Log Output */}
                  {(allLogs.length > 0) && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                        <Server className="size-5 text-primary" /> Live Log Eksekusi
                      </h3>
                      <div className="bg-[#1E1E1E] border border-[#404040] rounded-xl p-4 h-64 overflow-y-auto custom-scrollbar font-mono text-sm shadow-inner relative group">
                        <div className="flex gap-1.5 absolute top-3 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          {allLogs.map((log, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:gap-3 px-2 hover:bg-[#2A2D2E] rounded transition-colors break-words text-[#CCCCCC]">
                              {(() => {
                                const match = log.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
                                if (!match) return <span>{log}</span>;
                                
                                const time = new Date(match[1]).toLocaleTimeString('id-ID', { fractionalSecondDigits: 3 });
                                const module = match[2];
                                const msg = match[3];
                                
                                let moduleColor = "text-blue-400";
                                if (module === "RabbitMQ") moduleColor = "text-amber-500";
                                if (module === "MySQL") moduleColor = "text-emerald-500";
                                if (module === "Redis") moduleColor = "text-red-400";
                                if (module === "ElasticSearch") moduleColor = "text-indigo-400";
                                if (module === "MongoDB") moduleColor = "text-emerald-600";

                                return (
                                  <>
                                    <span className="text-[#858585] shrink-0">{time}</span>
                                    <span className={`shrink-0 w-32 uppercase font-bold text-xs flex items-center ${moduleColor}`}>{module}</span>
                                    <span className="group-hover:text-white transition-colors">{msg}</span>
                                  </>
                                );
                              })()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


