import { Header } from '@/components/layout/Header';
import { ActiveTickerHeader } from '@/components/trading/ActiveTickerHeader';
import { ChartCard } from '@/components/trading/ChartCard';
import { MarketStats } from '@/components/trading/MarketStats';
import { OrderPanel } from '@/components/trading/OrderPanel';
import { PortfolioTables } from '@/components/dashboard/PortfolioTables';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full selection:bg-indigo-500/30">
      <Header />
      
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Area (Left/Center) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            <ActiveTickerHeader />
            <ChartCard />
            <MarketStats />
            <PortfolioTables />
          </div>

          {/* Sidebar / Order Execution (Right) */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-[88px]">
              <OrderPanel />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
