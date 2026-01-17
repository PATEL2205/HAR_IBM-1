import { useEffect, useState } from 'react';

// Define the shape of your Flask response
interface ActivityData {
  activity: string;
  status: string;
}

export const Dashboard = () => {
  const [detectedActivity, setDetectedActivity] = useState<string>("INITIALIZING...");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Function to fetch activity from Flask
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/test'); // Adjust this to your HAR endpoint later
        if (!response.ok) throw new Error("Server unreachable");
        
        const data: ActivityData = await response.json();
        setDetectedActivity(data.activity || "UNKNOWN");
        setIsConnected(true);
      } catch (err) {
        console.error("Flask Connection Error:", err);
        setDetectedActivity("OFFLINE");
        setIsConnected(false);
      }
    };

    // Initial check
    fetchActivity();

    // Optional: Poll every 3 seconds for real-time updates
    const interval = setInterval(fetchActivity, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-blue-500">HAR-Cloud</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-slate-400">{isConnected ? 'Connected to Flask' : 'Flask Offline'}</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button className="text-left p-2 hover:bg-slate-800 rounded">Live Feed</button>
          <button className="text-left p-2 hover:bg-slate-800 rounded">History</button>
          <button className="text-left p-2 hover:bg-slate-800 rounded">Alerts</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative">
          <div className="aspect-video bg-black flex items-center justify-center">
             <span className="text-slate-500">Camera Feed Loading...</span>
          </div>
          
          {/* Dynamic Activity Label Overlay */}
          <div className={`absolute bottom-6 left-6 ${isConnected ? 'bg-blue-600/90' : 'bg-red-900/90'} px-4 py-2 rounded-lg`}>
            <p className="text-xs uppercase tracking-widest font-bold">Detected Activity</p>
            <h2 className="text-2xl font-black">{detectedActivity}</h2>
          </div>
        </div>
      </main>
    </div>
  );
};