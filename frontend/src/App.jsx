import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { Ship, Anchor, AlertTriangle, Activity, Map, Shield, ChevronRight, Sliders, MessageSquare, DollarSign, CloudLightning, Info, Send, Loader2, Leaf, Clock, TrendingUp, Lock, FileText, Settings, Bell, UploadCloud, PieChart, Layers } from 'lucide-react';

const portData = [
  { name: 'Kolkata', congestion: 65, waitDays: 4.2 },
  { name: 'Haldia', congestion: 45, waitDays: 2.1 },
  { name: 'Paradip', congestion: 85, waitDays: 6.5 },
  { name: 'Visakhapatnam', congestion: 30, waitDays: 1.2 },
  { name: 'Chennai', congestion: 55, waitDays: 3.4 },
  { name: 'Ennore', congestion: 20, waitDays: 0.8 },
  { name: 'Tuticorin', congestion: 40, waitDays: 2.0 },
];

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showAssistant, setShowAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [simulatorFuel, setSimulatorFuel] = useState(0);
  const [simulatorCongestion, setSimulatorCongestion] = useState(0);
  
  // Interactive States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showFleet, setShowFleet] = useState(false);
  
  const [isComputingCost, setIsComputingCost] = useState(false);
  const [showLandedCost, setShowLandedCost] = useState(false);
  
  const [whatIfFuel, setWhatIfFuel] = useState(15);
  const [whatIfCongestion, setWhatIfCongestion] = useState(14);
  const [whatIfVessel, setWhatIfVessel] = useState(-10);
  const [whatIfDemand, setWhatIfDemand] = useState(10);
  const [whatIfWeather, setWhatIfWeather] = useState(8);
  const [whatIfSpot, setWhatIfSpot] = useState(0);

  const simulateOptimization = () => {
     setIsOptimizing(true);
     setTimeout(() => {
        setIsOptimizing(false);
        setShowFleet(true);
     }, 1200);
  };

  const simulateCostCompute = () => {
     setIsComputingCost(true);
     setTimeout(() => {
        setIsComputingCost(false);
        setShowLandedCost(true);
     }, 1000);
  };

  // Fake chart data  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am FreightAI, your maritime decision intelligence assistant. How can I help you optimize your logistics today?' }
  ]);
  
  // Dynamic API State
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [shapData, setShapData] = useState({});
  const [currentRate, setCurrentRate] = useState(21.80);
  
  // Advanced Features State
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [etaData, setEtaData] = useState(null);
  const [etaOrigin, setEtaOrigin] = useState("Australia");
  const [etaDest, setEtaDest] = useState("Paradip");

  const fetchForecast = async (bunkerShock = 0, congestionShock = 0) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: "Australia",
          destination: "Paradip",
          bunker_shock: bunkerShock,
          congestion_shock: congestionShock
        })
      });
      if(response.ok) {
        const data = await response.json();
        setForecastData(data.trajectory || []);
        setShapData(data.explanation || {});
        if(data.current_predicted_rate) {
           setCurrentRate(data.current_predicted_rate);
        }
      }
    } catch (err) {
      console.error("Failed to fetch forecast. Make sure backend is running on port 8000.");
    }
    setLoading(false);
  };
  
  const fetchAdvanced = async () => {
    try {
      const susRes = await fetch('http://localhost:8000/api/sustainability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: etaOrigin, destination: etaDest, vessel_type: "Capesize" })
      });
      if(susRes.ok) setSustainabilityData(await susRes.json());
      
      const etaRes = await fetch('http://localhost:8000/api/eta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: etaOrigin, destination: etaDest, congestion: 65.0 })
      });
      if(etaRes.ok) setEtaData(await etaRes.json());
    } catch (err) {
      console.error("Failed to fetch advanced metrics.");
    }
  }

  useEffect(() => {
    fetchForecast();
  }, []);

  useEffect(() => {
    fetchAdvanced();
  }, [etaOrigin, etaDest]);

  const handleSimulate = () => {
    fetchForecast(simulatorFuel, simulatorCongestion);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
    const currentInput = chatInput;
    setChatInput('');
    
    setTimeout(() => {
      let aiResponse = `Based on the XGBoost model, the current freight rate is $${currentRate.toFixed(2)}/MT. I strongly recommend securing vessel capacity immediately due to high fuel impact (SHAP value: +${shapData.fuel_impact?.toFixed(2) || 0}).`;
      
      if (currentInput.toLowerCase().includes("cheapest") || currentInput.toLowerCase().includes("port")) {
         aiResponse = "Currently, Ennore port offers the lowest congestion index (20) and waiting time (0.8 days), making it the most cost-effective and fastest option for discharge on the East Coast of India.";
      }
      
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1500);
  };

  if (showLanding) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center text-slate-100 font-sans relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        </div>

        {/* Header */}
        <header className="absolute top-0 w-full p-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
              <Anchor className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold tracking-widest text-sm text-slate-200">MARITIME INTELLIGENCE</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">East Coast India Protocol</div>
            </div>
          </div>
          <button 
            onClick={() => setShowLanding(false)}
            className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-cyan-400 px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
          >
            Launch Intelligence Console <ChevronRight className="w-4 h-4" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-4xl px-4 mt-16">
          <div className="border border-slate-700/50 bg-slate-800/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-slate-400 mb-8 uppercase">
            AI-Powered Maritime Decision Support Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg">
            INTELLIGENT FREIGHT<br/>FORECASTING
          </h1>
          
          <p className="text-xl md:text-2xl font-bold text-cyan-400 mb-6 drop-shadow">
            Predict. Optimize. Procure. Move Smarter.
          </p>
          
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-12 leading-relaxed">
            Transform volatile historical and real-time maritime market telemetry into actionable decisions for overseas bulk cargo imported into India's East Coast ports.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-24">
            <button 
              onClick={() => setShowLanding(false)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              Launch Intelligence Console <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowLanding(false)}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-600 text-slate-300 px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" /> Explore Forecast Engine
            </button>
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
            {[
              { label: "FORECAST ACCURACY", value: "94.8%", sub: "Hybrid Ensemble R²" },
              { label: "TARGET EAST PORTS", value: "7 Hubs", sub: "Kolkata to Tuticorin" },
              { label: "ML MODELS COMBINED", value: "6 Models", sub: "XGB, RF, LSTM, SARIMA, GRU" },
              { label: "POTENTIAL SAVINGS", value: "+$127K", sub: "Per 75k MT Fixture" }
            ].map((stat, i) => (
              <div key={i} className="bg-navy-800/40 border border-navy-700/50 rounded-xl p-6 backdrop-blur-sm flex flex-col items-start text-left">
                <div className="text-[10px] text-slate-500 font-bold tracking-wider mb-2">{stat.label}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-[10px] text-slate-400">{stat.sub}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans flex overflow-hidden">
      {/* Massive Sidebar Navigation */}
      <aside className="w-64 bg-[#0d1527] border-r border-slate-800 p-4 hidden md:flex flex-col gap-1 shrink-0 h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2 mt-4">Decision Modules</div>
        {[
          { id: 'overview', label: 'Executive Dashboard', icon: Activity, tag: '' },
          { id: 'forecast', label: 'Freight Forecasting', icon: LineChart, tag: 'AI' },
          { id: 'charter', label: 'Vessel Chartering', icon: Ship, tag: 'Opt' },
          { id: 'cargo', label: 'Cargo Procurement', icon: FileText, tag: 'Opt' },
          { id: 'totalcost', label: 'Total Cost Simulator', icon: Layers, tag: 'Matrix' },
          { id: 'ports', label: 'Port Intelligence', icon: Map, tag: '7 Ports' },
          { id: 'sustainability', label: 'Route Intelligence', icon: Leaf, tag: 'Green' },
          { id: 'whatif', label: 'What-If Simulator', icon: Sliders, tag: 'Live' },
          { id: 'digitaltwin', label: 'Digital Twin Concept', icon: Clock, tag: 'Sim' },
          { id: 'risk', label: 'Risk Intelligence', icon: AlertTriangle, tag: '0-100' },
          { id: 'warning', label: 'Early Warning Center', icon: Bell, tag: 'Alerts' },
          { id: 'models', label: 'Model Performance', icon: PieChart, tag: '6 Models' },
          { id: 'data', label: 'Data Management', icon: UploadCloud, tag: 'Upload' },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left transition-all ${
              activeTab === item.id 
              ? 'bg-blue-500/10 text-cyan-400 border border-blue-500/20' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
               <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-cyan-400' : 'text-slate-500'}`} />
               <span className="font-medium text-[13px]">{item.label}</span>
            </div>
            {item.tag && (
               <span className="text-[9px] font-bold tracking-wider text-slate-500">{item.tag}</span>
            )}
          </button>
        ))}
        
        <div className="mt-auto pt-6 px-2">
           <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Decision Intelligence</div>
           <div className="text-[9px] text-slate-600">Predict. Optimize. Procure. Move Smarter.</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 h-screen overflow-y-auto bg-[#0b1121]">
        
        {/* Top Header Match Screenshot */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
           <div className="flex items-center gap-3">
             <div className="bg-blue-600/20 p-2 rounded-lg text-cyan-400 border border-blue-500/30">
               <Anchor className="w-5 h-5" />
             </div>
             <div>
                <h1 className="text-lg font-bold text-slate-200 tracking-wide leading-tight">INTELLIGENT FREIGHT FORECASTING <span className="text-slate-500 font-normal text-sm ml-2">EAST COAST INDIA</span></h1>
                <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">MARITIME DECISION INTELLIGENCE PLATFORM</h2>
             </div>
           </div>
           
           <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> DEMO / CALIBRATED SAMPLE DATA - Bay of Bengal Sector</span>
              <button onClick={() => setShowAssistant(true)} className="bg-cyan-900/40 text-cyan-400 text-xs font-bold px-4 py-2 rounded-lg border border-cyan-700/50 flex items-center gap-2 transition-all hover:bg-cyan-900/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                 <MessageSquare className="w-4 h-4"/> FreightAI Assistant <ChevronRight className="w-3 h-3"/>
              </button>
              <button className="text-slate-400 hover:text-slate-200">
                 <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                 <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold text-xs">AS</div>
                 <div className="text-xs">
                    <div className="font-bold text-slate-200">Ananya Sengupta</div>
                    <div className="text-slate-500">Executive</div>
                 </div>
              </div>
           </div>
        </header>

        {loading && forecastData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-cyan-400">
             <Loader2 className="w-8 h-8 animate-spin" />
             <span className="ml-3 font-semibold">Running ML Inference Pipeline...</span>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB - EXACT RECREATION OF SCREENSHOT */}
            {activeTab === 'overview' && (
              <div className="space-y-4 animate-in fade-in">
                
                {/* AI EXECUTIVE DIRECTIVE TOP CARD */}
                <div className="bg-[#111c33] border border-blue-900/40 rounded-xl p-5 shadow-lg shadow-black/40 flex justify-between items-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
                   
                   <div className="flex gap-4">
                      <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 h-fit">
                         <Activity className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-bold tracking-widest text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded uppercase">AI EXECUTIVE DIRECTIVE</span>
                            <span className="text-xs text-slate-400">Target: Newcastle (Aus) → Paradip Port (Coal)</span>
                         </div>
                         <h2 className="text-2xl font-bold text-white mb-2">Recommended Action: Charter Now (Priority Window)</h2>
                         <p className="text-sm text-slate-300 max-w-3xl">
                            Freight rates are projected to increase by <span className="text-rose-400 font-bold">+8.4%</span> over the next 14 days. Vessel availability in the Bay of Bengal is tightening. Securing vessel capacity within the <span className="text-cyan-400 font-bold">Next 5 to 8 Days</span> yields an estimated potential saving of <span className="text-emerald-400 font-bold">$137,250 USD</span> (₹1.18 Cr INR).
                         </p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4 z-10">
                      <button className="bg-cyan-500 hover:bg-cyan-400 text-navy-900 px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all">
                         Execute Charter
                      </button>
                      <button onClick={() => setShowAssistant(true)} className="text-slate-300 text-sm font-semibold hover:text-white transition-colors">
                         Consult FreightAI
                      </button>
                   </div>
                </div>

                {/* 6 STAT CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                   {/* Card 1 */}
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-4 shadow-md">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                         CURRENT FREIGHT <TrendingUp className="w-3 h-3 text-slate-400"/>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">${currentRate.toFixed(2)} <span className="text-sm text-slate-500 font-normal">/MT</span></div>
                      <div className="text-[10px] text-slate-400">Panamax Spot</div>
                   </div>
                   
                   {/* Card 2 */}
                   <div className="bg-[#14233f] border border-blue-800/40 rounded-xl p-4 shadow-md">
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 flex justify-between">
                         14D FORECAST
                      </div>
                      <div className="text-2xl font-bold text-cyan-400 mb-1">${(currentRate * 1.084).toFixed(2)} <span className="text-sm text-cyan-700 font-normal">/MT</span></div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1 rounded flex items-center">↑ +8.4%</span>
                         <span className="text-[10px] text-slate-400 border border-slate-700 px-1 rounded">AI Ensemble</span>
                      </div>
                   </div>
                   
                   {/* Card 3 */}
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-4 shadow-md">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                         CONFIDENCE SCORE
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">94.2%</div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] text-slate-400">Hybrid R²: 0.948</span>
                         <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">High Fit</span>
                      </div>
                   </div>
                   
                   {/* Card 4 */}
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-4 shadow-md">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                         MARITIME RISK <Info className="w-3 h-3 text-slate-400"/>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1 flex items-end gap-1">51 <span className="text-sm text-slate-500 font-normal mb-1">/ 100</span></div>
                      <div className="text-[10px] text-cyan-400 bg-cyan-900/30 border border-cyan-800 px-1 rounded w-fit">MEDIUM</div>
                   </div>
                   
                   {/* Card 5 */}
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-4 shadow-md">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                         FLEET AVAILABILITY <Lock className="w-3 h-3 text-slate-400"/>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">48.0%</div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] text-slate-400">Bay of Bengal</span>
                         <span className="text-[10px] text-rose-400">-8.5%</span>
                      </div>
                   </div>
                   
                   {/* Card 6 */}
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-4 shadow-md">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                         AVG PORT WAIT <Anchor className="w-3 h-3 text-slate-400"/>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">21.0 hrs</div>
                      <div className="text-[10px] text-slate-400">Paradip Queue: <span className="text-amber-400">Moderate</span></div>
                   </div>
                </div>

                {/* 4 MIDDLE BOXES */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-5 shadow-md">
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 bg-cyan-900/20 w-fit px-1">RECOMMENDED CHARTER WINDOW</div>
                      <div className="text-lg font-bold text-white mb-1">Next 5 to 8 Days</div>
                      <div className="text-[11px] text-cyan-400">Priority Booking Window</div>
                   </div>
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-5 shadow-md">
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 bg-cyan-900/20 w-fit px-1">RECOMMENDED PROCUREMENT</div>
                      <div className="text-lg font-bold text-white mb-1">BUY NOW (FOB + Freight)</div>
                      <div className="text-[11px] text-cyan-400">Hedge upcoming rate wave</div>
                   </div>
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-5 shadow-md flex justify-between items-start">
                      <div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">EST. TRANSPORTATION COST</div>
                         <div className="text-lg font-bold text-white mb-1">$1,635,000 USD</div>
                         <div className="text-[11px] text-slate-400">₹14.14 Cr INR (75K MT)</div>
                      </div>
                      <DollarSign className="w-4 h-4 text-slate-500" />
                   </div>
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-5 shadow-md border-b-2 border-b-emerald-500">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">PROJECTED COST SAVINGS</div>
                      <div className="text-lg font-bold text-emerald-400 mb-1">+$137,250 USD</div>
                      <div className="text-[11px] text-slate-400">By booking inside optimal window</div>
                   </div>
                </div>

                {/* BOTTOM MAP & CONGESTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-64">
                   <div className="lg:col-span-2 bg-[#111c33] border border-slate-800 rounded-xl p-5 shadow-md relative overflow-hidden flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-300 tracking-widest uppercase">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            INDIA EAST COAST MARITIME TELEMETRY MAP
                         </div>
                         <div className="text-[10px] text-slate-500">Kolkata — Tuticorin Corridor</div>
                      </div>
                      
                      {/* Fake Map visualization */}
                      <div className="flex-1 bg-[#0a1120] rounded-lg border border-slate-800 relative flex items-center justify-center overflow-hidden">
                         {/* Map UI overlays */}
                         <div className="absolute top-2 left-2 bg-slate-800/80 p-1 rounded flex flex-col gap-1 border border-slate-700 text-white z-10">
                            <div className="w-6 h-6 flex items-center justify-center font-bold text-xs border-b border-slate-600">+</div>
                            <div className="w-6 h-6 flex items-center justify-center font-bold text-xs">-</div>
                         </div>
                         
                         <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 flex gap-3 z-10 bg-[#0a1120]/80 px-2 py-1 rounded">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Low Risk</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Medium</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> High</span>
                         </div>
                         
                         {/* Glowing Map nodes */}
                         <div className="w-full h-full relative opacity-60 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/India_location_map.svg/1024px-India_location_map.svg.png')] bg-contain bg-center bg-no-repeat invert brightness-50 opacity-20"></div>
                         
                         <div className="absolute right-1/4 top-1/3 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center animate-pulse">
                               <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                            </div>
                            <div className="text-[9px] text-white font-bold mt-1 tracking-widest uppercase bg-black/50 px-1">Kolkata</div>
                         </div>
                         
                         <div className="absolute right-1/4 top-1/2 flex flex-col items-center mt-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center animate-pulse">
                               <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                            </div>
                            <div className="text-[10px] text-emerald-300 font-bold mt-1 tracking-widest bg-black/50 px-1 border border-emerald-500/30">PARADIP</div>
                         </div>
                         
                         <div className="absolute right-[28%] bottom-1/4 flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                            </div>
                            <div className="text-[8px] text-slate-300 font-bold mt-1 uppercase bg-black/50 px-1">Vizag</div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-[#111c33] border border-slate-800 rounded-xl p-5 shadow-md flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                         <div className="text-xs font-bold text-slate-300 tracking-widest uppercase">
                            PORT CONGESTION OVERVIEW
                         </div>
                         <div className="text-[9px] text-cyan-400 cursor-pointer">Full Matrix →</div>
                      </div>
                      
                      <div className="flex-1 overflow-hidden flex flex-col justify-center gap-4">
                         {portData.slice(0, 4).map((port, i) => (
                           <div key={i} className="flex justify-between items-center border-b border-slate-800 pb-2">
                              <span className="text-xs font-bold text-slate-300">{port.name}</span>
                              <div className="flex items-center gap-3">
                                 <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${port.congestion > 70 ? 'bg-rose-500' : port.congestion > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                      style={{width: `${port.congestion}%`}}
                                    ></div>
                                 </div>
                                 <span className="text-xs font-mono text-slate-400 w-6 text-right">{port.waitDays}d</span>
                              </div>
                           </div>
                         ))}
                      </div>
                      <button onClick={() => setShowAssistant(true)} className="w-full mt-4 bg-blue-600/20 text-cyan-400 py-2 rounded text-xs font-bold border border-blue-500/30 hover:bg-blue-600/40 transition-colors">Ask FreightAI About Ports</button>
                   </div>
                </div>
              </div>
            )}

            {/* OTHER TABS */}
            {activeTab === 'forecast' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-navy-800/40 border border-navy-700/50 rounded-xl p-6">
                   <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-cyan-400" />
                      Freight Rate Forecasting Module
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <select className="bg-navy-900 border border-navy-700 p-3 rounded-lg text-slate-200">
                        <option>Origin: Australia (Newcastle)</option>
                        <option>Origin: Indonesia (Samarinda)</option>
                      </select>
                      <select className="bg-navy-900 border border-navy-700 p-3 rounded-lg text-slate-200">
                        <option>Dest: Paradip, India</option>
                        <option>Dest: Visakhapatnam, India</option>
                      </select>
                      <button onClick={() => fetchForecast()} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-semibold transition-colors">Generate 90-Day Forecast</button>
                   </div>
                   
                   <div className="h-96">
                      {forecastData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="day" stroke="#475569" tick={{fill: '#475569'}} />
                          <YAxis stroke="#475569" tick={{fill: '#475569'}} domain={['auto', 'auto']} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }} />
                          <Legend />
                          <Area type="monotone" dataKey="upper" stroke="none" fill="#1e293b" name="Upper Bound (95% CI)" />
                          <Area type="monotone" dataKey="lower" stroke="none" fill="#0f172a" name="Lower Bound (95% CI)" />
                          <Line type="monotone" dataKey="xgb" stroke="#38bdf8" strokeWidth={3} name="Forecasted Rate ($/MT)" />
                        </ComposedChart>
                      </ResponsiveContainer>
                      )}
                   </div>
                </div>
              </div>
            )}
            {/* CHARTER TAB */}
            {activeTab === 'charter' && (
              <div className="space-y-4 animate-in fade-in">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                       <Ship className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">Vessel Chartering Optimization Engine</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">AI decision support for voyage fixtures, laycan timing, capacity allocation, and freight hedge optimization.</p>
                    
                    {/* Inputs Row */}
                    <div className="flex gap-4 items-end">
                       <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">ORIGIN</label>
                          <select className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none">
                             <option>Newcastle (Australia)</option>
                          </select>
                       </div>
                       <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">EAST PORT</label>
                          <select className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none">
                             <option>Paradip Port (PRT)</option>
                          </select>
                       </div>
                       <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">VESSEL TYPE</label>
                          <select className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none">
                             <option>Panamax (82k DWT)</option>
                          </select>
                       </div>
                       <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">CARGO (MT)</label>
                          <input type="text" value="75000" className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none" readOnly />
                       </div>
                       <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">CURRENT RATE</label>
                          <input type="text" value="21.8" className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none" readOnly />
                       </div>
                       <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">BUDGET ($)</label>
                          <input type="text" value="1800000" className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none" readOnly />
                       </div>
                       <button 
                          onClick={simulateOptimization}
                          className="bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 border border-cyan-500/50 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all w-36">
                          {isOptimizing ? <Activity className="w-4 h-4 animate-spin"/> : <Settings className="w-4 h-4"/>} 
                          {isOptimizing ? 'Running...' : 'Optimize'}
                       </button>
                    </div>
                 </div>

                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md mt-4">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <Lock className="w-4 h-4 text-cyan-400" />
                             <h3 className="text-sm font-bold text-white uppercase tracking-widest">REGIONAL FLEET AVAILABILITY & FIXTURE OPPORTUNITIES</h3>
                          </div>
                          <p className="text-xs text-slate-400">Bulk carriers operating within Indian Ocean & East Coast approaches</p>
                       </div>
                       <div className="text-xs text-slate-300">{showFleet ? '3' : '0'} Vessels Available for Prompt Laycan</div>
                    </div>

                    <table className="w-full text-left text-xs">
                       <thead className="text-[9px] text-slate-500 font-bold tracking-widest uppercase border-b border-slate-800">
                          <tr>
                             <th className="pb-3 px-2">VESSEL NAME</th>
                             <th className="pb-3 px-2">TYPE</th>
                             <th className="pb-3 px-2">DWT</th>
                             <th className="pb-3 px-2">STATUS</th>
                             <th className="pb-3 px-2">SPEED</th>
                             <th className="pb-3 px-2">FUEL / DAY</th>
                             <th className="pb-3 px-2">DAILY CHARTER</th>
                             <th className="pb-3 px-2 text-right">ACTION</th>
                          </tr>
                       </thead>
                       <tbody>
                          {!showFleet ? (
                             <tr>
                                <td colSpan="8" className="text-center py-12 text-slate-500">Waiting for optimization engine trigger...</td>
                             </tr>
                          ) : (
                             <>
                                <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                   <td className="py-3 px-2 font-bold text-slate-300">MV Ocean Pioneer</td>
                                   <td className="py-3 px-2 text-slate-400">Panamax</td>
                                   <td className="py-3 px-2 text-slate-400">82,500</td>
                                   <td className="py-3 px-2"><span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800">BALLAST</span></td>
                                   <td className="py-3 px-2 text-slate-400">12.5 kn</td>
                                   <td className="py-3 px-2 text-slate-400">28 MT</td>
                                   <td className="py-3 px-2 font-bold text-amber-400">$18,500</td>
                                   <td className="py-3 px-2 text-right"><button className="text-[10px] font-bold text-cyan-400 border border-cyan-800 hover:bg-cyan-900/40 px-3 py-1 rounded">FIX</button></td>
                                </tr>
                                <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                   <td className="py-3 px-2 font-bold text-slate-300">MV Star Bulk</td>
                                   <td className="py-3 px-2 text-slate-400">Kamsarmax</td>
                                   <td className="py-3 px-2 text-slate-400">81,200</td>
                                   <td className="py-3 px-2"><span className="text-[9px] font-bold text-amber-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-800">DISCHARGING</span></td>
                                   <td className="py-3 px-2 text-slate-400">13.0 kn</td>
                                   <td className="py-3 px-2 text-slate-400">30 MT</td>
                                   <td className="py-3 px-2 font-bold text-amber-400">$19,200</td>
                                   <td className="py-3 px-2 text-right"><button className="text-[10px] font-bold text-cyan-400 border border-cyan-800 hover:bg-cyan-900/40 px-3 py-1 rounded">FIX</button></td>
                                </tr>
                                <tr className="hover:bg-slate-800/30">
                                   <td className="py-3 px-2 font-bold text-slate-300">MV Golden Eagle</td>
                                   <td className="py-3 px-2 text-slate-400">Panamax</td>
                                   <td className="py-3 px-2 text-slate-400">79,800</td>
                                   <td className="py-3 px-2"><span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800">BALLAST</span></td>
                                   <td className="py-3 px-2 text-slate-400">11.5 kn</td>
                                   <td className="py-3 px-2 text-slate-400">25 MT</td>
                                   <td className="py-3 px-2 font-bold text-amber-400">$17,900</td>
                                   <td className="py-3 px-2 text-right"><button className="text-[10px] font-bold text-cyan-400 border border-cyan-800 hover:bg-cyan-900/40 px-3 py-1 rounded">FIX</button></td>
                                </tr>
                             </>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
            {/* CARGO PROCUREMENT TAB */}
            {activeTab === 'cargo' && (
              <div className="space-y-4 animate-in fade-in">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                       <FileText className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">Bulk Cargo Procurement & Total Landed Cost Intelligence</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">FOB price trends, ocean freight integration, port handling tariffs, and buy-window recommendations.</p>
                    
                    {/* Inputs Row */}
                    <div className="flex gap-4 items-end">
                       <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">PORT OF DISCHARGE</label>
                          <select className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none">
                             <option>Paradip Port (PRT)</option>
                          </select>
                       </div>
                       <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">CARGO QUANTITY (MT)</label>
                          <input type="text" value="75000" className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none" readOnly />
                       </div>
                       <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">COMMODITY PRICE ($/MT)</label>
                          <input type="text" value="128.5" className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none" readOnly />
                       </div>
                       <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">OCEAN FREIGHT ($/MT)</label>
                          <input type="text" value="21.8" className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none" readOnly />
                       </div>
                       <button 
                          onClick={simulateCostCompute}
                          className="bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 border border-cyan-500/50 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all h-[42px] w-48">
                          {isComputingCost ? <Activity className="w-4 h-4 animate-spin"/> : 'Compute Landed Cost'}
                       </button>
                    </div>
                 </div>

                 {showLandedCost && (
                    <div className="bg-[#0a1120] border border-emerald-500/30 rounded-xl p-6 animate-in slide-in-from-top-4">
                       <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Calculated Landed Cost Breakdown</h3>
                       </div>
                       <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="bg-[#111c33] p-4 rounded-lg border border-slate-700 text-center">
                             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Commodity Cost</div>
                             <div className="text-xl font-mono text-slate-300">$9,637,500</div>
                          </div>
                          <div className="bg-[#111c33] p-4 rounded-lg border border-slate-700 text-center">
                             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Ocean Freight</div>
                             <div className="text-xl font-mono text-slate-300">$1,635,000</div>
                          </div>
                          <div className="bg-[#111c33] p-4 rounded-lg border border-slate-700 text-center">
                             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Port Tariffs & Dues</div>
                             <div className="text-xl font-mono text-slate-300">$212,500</div>
                          </div>
                          <div className="bg-[#0d1527] p-4 rounded-lg border-2 border-emerald-500/50 text-center">
                             <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Total Landed Cost</div>
                             <div className="text-2xl font-bold font-mono text-white">$11,485,000</div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            )}

            {/* PORTS TAB */}
            {activeTab === 'ports' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <Anchor className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">India East Coast Port Congestion & Berth Intelligence</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">Dedicated operational monitoring across all 7 major bulk discharge ports along the Bay of Bengal.</p>
                    
                    {/* Fake Map visualization */}
                    <div className="flex-1 bg-[#0a1120] rounded-lg border border-slate-800 relative flex items-center justify-center overflow-hidden mb-6 min-h-[300px]">
                       <div className="absolute top-2 left-2 bg-slate-800/80 p-1 rounded flex flex-col gap-1 border border-slate-700 text-white z-10">
                          <div className="w-6 h-6 flex items-center justify-center font-bold text-xs border-b border-slate-600">+</div>
                          <div className="w-6 h-6 flex items-center justify-center font-bold text-xs">-</div>
                       </div>
                       
                       <div className="absolute top-2 left-12 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 z-10">
                          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">India East Coast Maritime Corridor</div>
                          <div className="text-[9px] text-slate-400 flex gap-2 mt-1">
                             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Low Risk</span>
                             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Medium</span>
                             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> High</span>
                          </div>
                       </div>
                       
                       <div className="w-full h-full relative opacity-80 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/India_location_map.svg/1024px-India_location_map.svg.png')] bg-contain bg-center bg-no-repeat invert brightness-50 opacity-20"></div>
                       
                       {/* Map Points matching screenshot */}
                       <div className="absolute right-[30%] top-[30%] flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center animate-pulse">
                             <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          </div>
                          <div className="text-[10px] text-white font-bold mt-1 tracking-widest bg-black/60 px-1.5 rounded border border-slate-700">HLD</div>
                       </div>
                       
                       <div className="absolute right-[32%] top-[40%] flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-pulse shadow-[0_0_15px_#34d399]">
                             <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                          </div>
                          <div className="text-[10px] text-emerald-300 font-bold mt-1 tracking-widest bg-black/60 px-1.5 rounded border border-emerald-500/50">PRT</div>
                       </div>
                       
                       <div className="absolute right-[38%] top-[55%] flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          </div>
                          <div className="text-[10px] text-slate-300 font-bold mt-1 tracking-widest bg-black/60 px-1.5 rounded border border-slate-700">VTZ</div>
                       </div>
                       
                       <div className="absolute right-[43%] bottom-[30%] flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                             <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          </div>
                          <div className="text-[10px] text-amber-300 font-bold mt-1 tracking-widest bg-black/60 px-1.5 rounded border border-amber-500/50">MAA</div>
                       </div>
                       
                       <div className="absolute right-[46%] bottom-[15%] flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          </div>
                          <div className="text-[10px] text-emerald-300 font-bold mt-1 tracking-widest bg-black/60 px-1.5 rounded border border-emerald-500/50">TUT</div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                       <Layers className="w-4 h-4 text-cyan-400" />
                       <h3 className="text-sm font-bold text-white uppercase tracking-widest">COMPARATIVE PORT BENCHMARKING MATRIX</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">Side-by-side performance indicators across all 7 Indian East Coast terminals</p>
                    
                    <div className="h-48 border border-slate-800 rounded-lg p-2 bg-[#0a1120]">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={portData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                           <XAxis dataKey="name" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} />
                           <YAxis yAxisId="left" orientation="left" stroke="#38bdf8" tick={{fontSize: 10}} />
                           <YAxis yAxisId="right" orientation="right" stroke="#fbbf24" tick={{fontSize: 10}} />
                           <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }} />
                           <Bar yAxisId="left" dataKey="congestion" name="Congestion Index" fill="#38bdf8" radius={[2, 2, 0, 0]} barSize={20} />
                           <Bar yAxisId="right" dataKey="waitDays" name="Wait Time (Days)" fill="#fbbf24" radius={[2, 2, 0, 0]} barSize={20} />
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
            )}
            {/* ROUTE INTELLIGENCE TAB (sustainability) */}
            {activeTab === 'sustainability' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Leaf className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">Maritime Route Intelligence & Green Shipping Analytics</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Benchmark overseas bulk sea lanes into Indian East Coast ports across transit time, landed cost, congestion risk, and CO₂ emissions.</p>
                    
                    <div className="flex gap-4 items-end mb-6">
                       <div className="w-1/3">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">TRADE ORIGIN</label>
                          <select className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none">
                             <option>Newcastle (Australia) — Coal</option>
                          </select>
                       </div>
                       <div className="w-1/3">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">CARGO PARCEL (MT)</label>
                          <input type="text" value="75000" className="w-full bg-[#0d1527] border border-slate-700 p-2.5 rounded-lg text-slate-200 text-sm outline-none" readOnly />
                       </div>
                       <div className="w-1/3 flex justify-end">
                          <button className="bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 border border-cyan-500/50 w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all">
                             <Activity className="w-4 h-4"/> Evaluate Alternative Routes
                          </button>
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">SELECT DESTINATION PORTS TO COMPARE:</label>
                       <div className="flex flex-wrap gap-3">
                          {['Paradip Port (PRT)', 'Visakhapatnam (Vizag) (VTZ)', 'Chennai Port (MAA)', 'Haldia Dock (HLD)', 'Ennore Port (ENR)', 'Tuticorin Port (TUT)'].map(port => (
                             <div key={port} className="bg-cyan-900/20 border border-cyan-800/50 text-cyan-400 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-cyan-900/40 transition-colors">
                                {port}
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* WHAT-IF SIMULATOR TAB */}
            {activeTab === 'whatif' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2">
                          <Sliders className="w-5 h-5 text-slate-300" />
                          <h2 className="text-xl font-bold text-slate-200">Interactive "What-If" Scenario Simulator</h2>
                       </div>
                       <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1"><Settings className="w-3 h-3"/> Reset to Baseline</button>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Test macroeconomic shocks, fuel volatility, and port disruptions with instantaneous multi-variate recalculations.</p>
                    
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Sliders className="w-4 h-4" /> INTERACTIVE MULTI-FACTOR CONTROL KNOBS
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {/* Row 1 */}
                       <div className="bg-[#0a1120] border border-slate-800 p-4 rounded-xl transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          <div className="flex justify-between mb-4">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><DollarSign className="w-4 h-4 text-amber-500"/> Fuel Price Shift (VLSFO)</div>
                             <div className={`text-xs font-bold ${whatIfFuel > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{whatIfFuel > 0 ? '+' : ''}{whatIfFuel}%</div>
                          </div>
                          <input type="range" min="-40" max="40" value={whatIfFuel} onChange={e => setWhatIfFuel(Number(e.target.value))} className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer mb-2" />
                          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest">
                             <span>-40% Bearish</span>
                             <span>Baseline (0%)</span>
                             <span>+40% Bullish</span>
                          </div>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 p-4 rounded-xl transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          <div className="flex justify-between mb-4">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><Anchor className="w-4 h-4 text-rose-500"/> East Port Congestion Shift</div>
                             <div className={`text-xs font-bold ${whatIfCongestion > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{whatIfCongestion > 0 ? '+' : ''}{whatIfCongestion}%</div>
                          </div>
                          <input type="range" min="-40" max="40" value={whatIfCongestion} onChange={e => setWhatIfCongestion(Number(e.target.value))} className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer mb-2" />
                          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest">
                             <span>-40% Easing</span>
                             <span>Baseline</span>
                             <span>+40% Gridlock</span>
                          </div>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 p-4 rounded-xl transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          <div className="flex justify-between mb-4">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><Ship className="w-4 h-4 text-cyan-500"/> Regional Vessel Availability</div>
                             <div className={`text-xs font-bold ${whatIfVessel < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{whatIfVessel > 0 ? '+' : ''}{whatIfVessel}%</div>
                          </div>
                          <input type="range" min="-40" max="40" value={whatIfVessel} onChange={e => setWhatIfVessel(Number(e.target.value))} className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer mb-2" />
                          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest">
                             <span>-40% Deficit</span>
                             <span>Baseline</span>
                             <span>+40% Surplus</span>
                          </div>
                       </div>
                       
                       {/* Row 2 */}
                       <div className="bg-[#0a1120] border border-slate-800 p-4 rounded-xl transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          <div className="flex justify-between mb-4">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><FileText className="w-4 h-4 text-emerald-500"/> Commodity Import Demand</div>
                             <div className={`text-xs font-bold ${whatIfDemand > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{whatIfDemand > 0 ? '+' : ''}{whatIfDemand}%</div>
                          </div>
                          <input type="range" min="-40" max="40" value={whatIfDemand} onChange={e => setWhatIfDemand(Number(e.target.value))} className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer mb-2" />
                          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest">
                             <span>-40% Slump</span>
                             <span>Baseline</span>
                             <span>+40% Surge</span>
                          </div>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 p-4 rounded-xl transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          <div className="flex justify-between mb-4">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><CloudLightning className="w-4 h-4 text-blue-400"/> Bay of Bengal Weather Risk</div>
                             <div className={`text-xs font-bold ${whatIfWeather > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{whatIfWeather > 0 ? '+' : ''}{whatIfWeather}%</div>
                          </div>
                          <input type="range" min="-40" max="40" value={whatIfWeather} onChange={e => setWhatIfWeather(Number(e.target.value))} className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer mb-2" />
                          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest">
                             <span>-40% Calmer</span>
                             <span>Baseline</span>
                             <span>+40% Storm</span>
                          </div>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 p-4 rounded-xl transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                          <div className="flex justify-between mb-4">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><TrendingUp className="w-4 h-4 text-emerald-400"/> Direct Freight Spot Shift</div>
                             <div className={`text-xs font-bold ${whatIfSpot > 0 ? 'text-rose-400' : (whatIfSpot === 0 ? 'text-slate-400' : 'text-emerald-400')}`}>{whatIfSpot > 0 ? '+' : ''}{whatIfSpot}%</div>
                          </div>
                          <input type="range" min="-40" max="40" value={whatIfSpot} onChange={e => setWhatIfSpot(Number(e.target.value))} className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer mb-2" />
                          <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest">
                             <span>-40% Drop</span>
                             <span>Baseline</span>
                             <span>+40% Spike</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-4 p-4 border border-cyan-500/30 rounded-xl bg-cyan-900/10 flex items-center justify-between transition-all">
                       <div>
                          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Instantaneous Impact Analysis</div>
                          <div className="text-sm text-slate-300">Total systemic effect on East Coast logistics given current slider weights.</div>
                       </div>
                       <div className="text-right">
                          <div className="text-2xl font-bold font-mono text-white">
                             {whatIfFuel + whatIfCongestion - whatIfVessel + whatIfDemand + whatIfWeather + whatIfSpot > 0 ? '+' : ''}
                             {((whatIfFuel + whatIfCongestion - whatIfVessel + whatIfDemand + whatIfWeather + whatIfSpot) * 1.5).toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-400">Predicted Freight Premium</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* DIGITAL TWIN CONCEPT TAB */}
            {activeTab === 'digitaltwin' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Activity className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">Maritime Digital Twin & Predictive Voyage ETA Simulation</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Real-time synchronized simulation of physical bulk vessels, Bay of Bengal cyclone detours, dynamic ETA drift, and demurrage cascades.</p>
                    
                    <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-6 h-96 flex items-center justify-center text-slate-500">
                       <div className="text-center">
                          <Lock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                          <div className="text-xs font-bold tracking-widest uppercase mb-1">ACTIVE SIMULATED MARITIME VOYAGES IN TRANSIT</div>
                          <div className="text-[10px]">Loading AIS telemetry stream...</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* RISK INTELLIGENCE TAB */}
            {activeTab === 'risk' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Shield className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">Maritime Freight Risk Prediction Engine (0-100 Index)</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Real-time composite maritime risk index evaluating volatility, port congestion, fleet supply, and Bay of Bengal weather.</p>
                    
                    <div className="bg-[#14233f] border border-slate-700 rounded-xl p-6 mb-6 flex justify-between items-center">
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded uppercase border border-emerald-800">RISK CLASSIFICATION TIER</div>
                             <div className="text-xs text-slate-400">Corridor: Australia → Paradip Port</div>
                          </div>
                          <h2 className="text-4xl font-bold text-white mb-6">Current Risk: <span className="text-amber-500">MEDIUM (51 / 100)</span></h2>
                          
                          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-8">
                             <p className="text-sm text-slate-300">
                                <span className="font-bold text-cyan-400">Executive Assessment:</span> Maritime Freight Risk is MEDIUM (51/100). Primary pressure points are driven by Port Congestion and Vessel Availability Squeeze.
                             </p>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex w-full gap-2">
                             <div className="flex-1 border-t-2 border-slate-700 pt-2 text-center opacity-50">
                                <div className="text-xs font-bold text-emerald-500">0 - 30</div>
                                <div className="text-[9px] uppercase tracking-widest text-slate-400">LOW RISK</div>
                             </div>
                             <div className="flex-1 border-t-2 border-amber-500 pt-2 text-center bg-amber-500/10 rounded-b-lg border-x border-b border-amber-500/20 pb-2 -mt-0.5">
                                <div className="text-xs font-bold text-amber-500">31 - 60</div>
                                <div className="text-[9px] uppercase tracking-widest text-amber-400">MEDIUM RISK</div>
                             </div>
                             <div className="flex-1 border-t-2 border-slate-700 pt-2 text-center opacity-50">
                                <div className="text-xs font-bold text-orange-500">61 - 80</div>
                                <div className="text-[9px] uppercase tracking-widest text-slate-400">HIGH RISK</div>
                             </div>
                             <div className="flex-1 border-t-2 border-slate-700 pt-2 text-center opacity-50">
                                <div className="text-xs font-bold text-rose-500">81 - 100</div>
                                <div className="text-[9px] uppercase tracking-widest text-slate-400">CRITICAL RISK</div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="w-48 flex flex-col items-center justify-center border-l border-slate-700 pl-8 ml-8">
                          <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-amber-500 border-r-amber-500 flex items-center justify-center flex-col">
                             <div className="text-2xl font-bold text-white leading-none">51</div>
                             <div className="text-[9px] text-slate-500">/ 100</div>
                          </div>
                          <div className="text-xs font-bold text-slate-400 mt-4 text-center">Composite Index</div>
                       </div>
                    </div>
                    
                    <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-4">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
                          <Activity className="w-4 h-4 text-cyan-400" /> COMPONENT RISK FACTORS & SUB-SCORE ATTRIBUTION
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* EARLY WARNING CENTER TAB */}
            {activeTab === 'warning' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Bell className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">AI Early Warning & Market Disruption Center</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Autonomous anomaly detector monitoring freight spikes, bunker surges, tonnage squeezes, and Bay of Bengal cyclones.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                       <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-5 shadow-inner">
                          <div className="flex justify-between items-start mb-2">
                             <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">CRITICAL ALERTS</div>
                             <AlertTriangle className="w-4 h-4 text-rose-500" />
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">1</div>
                          <div className="text-xs text-slate-400">Rate Spikes & Cyclones</div>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-5 shadow-inner">
                          <div className="flex justify-between items-start mb-2">
                             <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">WARNING NOTICES</div>
                             <AlertTriangle className="w-4 h-4 text-amber-500" />
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">2</div>
                          <div className="text-xs text-slate-400">Vessel Deficit & Port Queues</div>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-5 shadow-inner">
                          <div className="flex justify-between items-start mb-2">
                             <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">OPPORTUNITIES</div>
                             <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-500">↑</div>
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">1</div>
                          <div className="text-xs text-slate-400">Favorable Spot Window</div>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-5 shadow-inner">
                          <div className="flex justify-between items-start mb-2">
                             <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">ACTIVE NOTIFICATIONS</div>
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">4</div>
                          <div className="text-xs text-slate-400">Automated AI Triggers</div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                       <div className="text-xs text-slate-400 flex items-center gap-1"><Settings className="w-3 h-3"/> FILTER:</div>
                       <button className="bg-cyan-900/40 text-cyan-400 border border-cyan-700/50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">ALL</button>
                       <button className="text-slate-400 hover:text-slate-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">CRITICAL</button>
                       <button className="text-slate-400 hover:text-slate-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">WARNING</button>
                       <button className="text-slate-400 hover:text-slate-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">OPPORTUNITY</button>
                    </div>
                 </div>
              </div>
            )}
            {/* MODEL PERFORMANCE TAB */}
            {activeTab === 'models' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <PieChart className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">AI/ML Model Benchmark & Evaluation Leaderboard</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Comparative empirical performance of 6 forecasting models on holdout test datasets across Indian East Coast corridors.</p>
                    
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
                          <Activity className="w-4 h-4 text-cyan-400" /> MODEL PERFORMANCE COMPARISON MATRIX
                       </div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest">Target Metrics: MAE • RMSE</div>
                    </div>
                    
                    <div className="bg-[#0a1120] border border-slate-800 rounded-lg overflow-hidden mb-6">
                       <table className="w-full text-left text-xs">
                          <thead className="bg-[#0d1527] text-[9px] text-slate-500 font-bold tracking-widest uppercase border-b border-slate-800">
                             <tr>
                                <th className="p-3">MODEL ARCHITECTURE</th>
                                <th className="p-3">PRIMARY USE CASE</th>
                                <th className="p-3">MAE ($/MT)</th>
                                <th className="p-3">RMSE ($/MT)</th>
                                <th className="p-3">MAPE (%)</th>
                                <th className="p-3">R² SCORE</th>
                                <th className="p-3 text-right">ENSEMBLE WEIGHT</th>
                             </tr>
                          </thead>
                          <tbody>
                             <tr className="border-b border-slate-800 bg-cyan-900/10">
                                <td className="p-3 font-bold text-cyan-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>XGBoost (Gradient Boost)</td>
                                <td className="p-3 text-slate-400">Non-linear shocks, bunker volatility</td>
                                <td className="p-3 font-mono text-emerald-400">0.82</td>
                                <td className="p-3 font-mono text-emerald-400">1.15</td>
                                <td className="p-3 font-mono text-emerald-400">3.8%</td>
                                <td className="p-3 font-mono font-bold text-white">0.948</td>
                                <td className="p-3 text-right text-slate-300">45%</td>
                             </tr>
                             <tr className="border-b border-slate-800">
                                <td className="p-3 font-bold text-slate-300">LSTM (Neural Network)</td>
                                <td className="p-3 text-slate-400">Long-term sequential time-series</td>
                                <td className="p-3 font-mono text-slate-300">1.04</td>
                                <td className="p-3 font-mono text-slate-300">1.38</td>
                                <td className="p-3 font-mono text-slate-300">4.5%</td>
                                <td className="p-3 font-mono font-bold text-slate-300">0.892</td>
                                <td className="p-3 text-right text-slate-300">25%</td>
                             </tr>
                             <tr className="border-b border-slate-800">
                                <td className="p-3 font-bold text-slate-300">Random Forest</td>
                                <td className="p-3 text-slate-400">Baseline robust regression</td>
                                <td className="p-3 font-mono text-slate-300">1.15</td>
                                <td className="p-3 font-mono text-slate-300">1.45</td>
                                <td className="p-3 font-mono text-slate-300">5.1%</td>
                                <td className="p-3 font-mono font-bold text-slate-300">0.865</td>
                                <td className="p-3 text-right text-slate-300">15%</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                       <BarChart className="w-4 h-4 text-slate-500" /> COMPARATIVE ERROR DISTRIBUTION (MAE & RMSE IN USD/MT)
                    </div>
                    <div className="flex-1 border border-slate-800 rounded-lg p-4 bg-[#0a1120] flex items-center justify-center">
                       <div className="text-slate-500 text-sm flex flex-col items-center gap-2">
                          <BarChart className="w-12 h-12 opacity-50" />
                          <span>Generating comparative distribution chart...</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* DATA MANAGEMENT TAB */}
            {activeTab === 'data' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col">
                 <div className="bg-[#111c33] border border-slate-800 rounded-xl p-6 shadow-md flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <UploadCloud className="w-5 h-5 text-slate-300" />
                       <h2 className="text-xl font-bold text-slate-200">Maritime Data Ingestion & Automated Quality Profiler</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Upload and validate external maritime datasets with automated missing-value imputation, duplicate filtering, and outlier profiling.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-6">
                          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6">DATASET INGESTION PIPELINE</div>
                          
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">DATASET CATEGORY</label>
                          <select className="w-full bg-[#0d1527] border border-slate-700 p-3 rounded-lg text-slate-200 text-sm outline-none mb-6">
                             <option>Historical Freight Rates (USD/MT)</option>
                          </select>
                          
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">CSV OR EXCEL FILE</label>
                          <div className="border-2 border-dashed border-slate-700 bg-[#0d1527] rounded-xl p-8 flex flex-col items-center justify-center mb-6 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                             <UploadCloud className="w-8 h-8 text-cyan-500/50 group-hover:text-cyan-400 mb-3" />
                             <div className="flex gap-2 items-center mb-2">
                                <span className="bg-cyan-600/20 text-cyan-400 px-3 py-1 rounded text-xs font-bold border border-cyan-500/30">Choose file</span>
                                <span className="text-slate-400 text-sm">No file chosen</span>
                             </div>
                             <div className="text-[10px] text-slate-500">Max file size: 50MB. Auto-cleaned on upload.</div>
                          </div>
                          
                          <button className="w-full bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/50 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                             <CloudLightning className="w-4 h-4"/> Ingest & Generate Quality Report
                          </button>
                       </div>
                       
                       <div className="bg-[#0a1120] border border-slate-800 rounded-xl p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-6">
                             <div>
                                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">ACTIVE SEEDED DATASETS (EAST COAST INDIA)</div>
                                <div className="text-[9px] text-slate-500">Pre-calibrated 365-day time-series telemetry ready for immediate modeling</div>
                             </div>
                             <div className="text-[9px] font-bold text-emerald-500 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800 tracking-widest">READY / SYNCED</div>
                          </div>
                          <div className="text-sm text-slate-400">Loading datasets status...</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
            
            {/* ... other tabs remain functionally same but abbreviated for snippet sake ... */}
            {(activeTab === 'fake') && (
               <div className="flex h-64 items-center justify-center border border-dashed border-slate-700 rounded-xl text-slate-500">
                  Select a module from the sidebar.
               </div>
            )}

          </>
        )}
      </main>

      {/* FreightAI Slide-out Assistant */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-[#0d1527] border-l border-slate-800 shadow-2xl shadow-black transform transition-transform duration-300 z-50 flex flex-col ${showAssistant ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#111c33]">
            <div className="flex items-center gap-2">
               <div className="bg-cyan-600/20 p-1.5 rounded text-cyan-400 border border-cyan-500/30">
                  <MessageSquare className="w-4 h-4" />
               </div>
               <div>
                  <div className="font-bold text-sm text-slate-200 leading-tight">FreightAI</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Decision Intelligence & Advisory</div>
               </div>
            </div>
            <button onClick={() => setShowAssistant(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#0b1121]">
            <div className="flex gap-3">
               <div className="w-6 h-6 rounded-full bg-cyan-900/50 flex items-center justify-center shrink-0 border border-cyan-700">
                  <Activity className="w-3 h-3 text-cyan-400" />
               </div>
               <div className="space-y-4">
                  <p className="text-sm text-slate-300">👋 Welcome to **FreightAI** — your specialized Maritime Decision Intelligence copilot.</p>
                  <p className="text-sm text-slate-300">I am trained on historical fixtures, Bay of Bengal weather patterns, East Coast port congestion, and fuel indices.</p>
                  <p className="text-sm text-slate-300">How can I assist your chartering or bulk procurement decisions today?</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                     {["Should I charter a vessel now?", "Which East Coast port is cheapest?", "Why did freight rates increase?", "What happens if fuel prices increase by 20%?", "Give me the lowest-risk option."].map(prompt => (
                        <button key={prompt} className="text-left text-xs bg-[#111c33] border border-slate-700 text-slate-300 px-3 py-2 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-colors shadow-sm shadow-black/20">
                           {prompt}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>
         <div className="p-4 border-t border-slate-800 bg-[#111c33]">
            <div className="relative">
               <input type="text" placeholder="Message FreightAI..." className="w-full bg-[#0a1120] border border-slate-700 rounded-lg py-3 px-4 text-sm text-slate-200 outline-none focus:border-cyan-500 shadow-inner" />
               <button className="absolute right-2 top-2 bg-cyan-600/20 text-cyan-400 p-1.5 rounded hover:bg-cyan-600/40 transition-colors border border-cyan-500/20">
                  <Send className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
