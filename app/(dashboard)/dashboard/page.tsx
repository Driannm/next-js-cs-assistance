import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

// icon
import { 
  Users, 
  Truck, 
  ClipboardList, 
  SkipForward, 
  Flame, 
  CalendarDays, 
  AlertTriangle,
  UtensilsCrossed
} from "lucide-react";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Uncomment jika auth sudah jalan
  if (!token) redirect("/login");
  const user = verifyToken(token);
  if (!user) redirect("/login");

  // ----- Dummy data -----
  // Format tanggal yang lebih singkat dan padat
  const dateObj = new Date();
  const dateDay = dateObj.toLocaleDateString("id-ID", { weekday: "long" });
  const dateFull = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  // Kita pisahkan data numerik untuk Grid 2 kolom
  const stats = [
    { label: "Pelanggan Aktif", value: 18, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Order Berjalan", value: 12, icon: ClipboardList, color: "bg-green-100 text-green-600" },
    { label: "Pengiriman", value: 9, icon: Truck, color: "bg-orange-100 text-orange-600" },
    { label: "Skip Hari Ini", value: 3, icon: SkipForward, color: "bg-purple-100 text-purple-600" },
  ];

  // Data highlight (String panjang) dipisah agar tidak merusak grid
  const highlight = { label: "Menu Terfavorit", value: "Ayam Sambal Matah", icon: Flame };

  const menuToday = [
    { name: "Ayam Geprek", total: 3, variant: "Menu A" },
    { name: "Ayam Lada Hitam", total: 4, variant: "Menu B" },
    { name: "Ayam Teriyaki", total: 2, variant: "Menu C" },
  ];

  const reminders = [
    "3 pelanggan belum dipilihkan menu besok",
    "2 langganan mau habis minggu ini",
    "1 pelanggan baru butuh paket",
  ];

  return (
    <div className="relative">
      
      {/* 1. Header Section (Sticky) */}
      {/* Menggantikan search bar dengan informasi Tanggal & User yang rapi */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
           <div className="flex items-center gap-1.5 text-pink-500 font-semibold text-xs uppercase tracking-wider mb-0.5">
             <CalendarDays className="w-3.5 h-3.5" />
             <span>{dateDay}</span>
           </div>
           <p className="text-gray-600 text-xs font-medium">{dateFull}</p>
        </div>
        
        {/* Avatar / Profile simple */}
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm border-2 border-white shadow-sm">
          AD
        </div>
      </header>

      <div className="px-6 py-6 space-y-8">
        
        {/* Greeting */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800 leading-tight">
            Selamat Pagi, <br/> 
            <span className="text-pink-400">Cantikk!</span> ❤️
          </h1>
          <p className="text-sm text-gray-500">Semangat kerjanya hari ini ya.</p>
        </div>

        {/* Section: Ringkasan Statistik */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Ringkasan</h2>
          
          {/* Grid Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="p-4 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between h-32 hover:border-pink-200 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                    <p className="text-[11px] font-medium text-gray-400">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlight Card (Full Width) */}
          <div className="p-5 bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl shadow-lg shadow-pink-200 text-white flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-pink-100 text-xs font-medium mb-1">{highlight.label}</p>
              <p className="text-lg font-bold">{highlight.value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full relative z-10 backdrop-blur-sm">
              <highlight.icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Dekorasi Background */}
            <Flame className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
          </div>
        </div>

        {/* Section: Rekap Menu */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Menu Hari Ini</h2>
            <span className="text-xs text-pink-400 font-medium bg-pink-50 px-2 py-1 rounded-full">Total: 9 Porsi</span>
          </div>

          <div className="space-y-3">
            {menuToday.map((item) => (
              <div
                key={item.name}
                className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-pink-300 transition-all shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-400 transition-colors w-12 h-12 rounded-xl flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{item.variant}</p>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-lg text-gray-800">{item.total}</span>
                  <span className="text-[10px] text-gray-400">porsi</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Reminder */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Perlu Perhatian</h2>

          <div className="space-y-3">
            {reminders.map((text, i) => (
              <div
                key={i}
                className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex gap-3 items-start"
              >
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}