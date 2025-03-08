import * as React from "react";
import { useState, useEffect } from "react";
import {
  getPurchases,
  getSales,
  getMonthlyStatistics,
  getYearlyStatistics,
} from "../../lib/api";
import type {
  PurchaseRecord,
  SaleRecord,
  MonthlyStatisticsDto,
  YearlyStatisticsDTO,
  PageResponse,
} from "../../lib/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProfitLossModal from "./ProfitLossModal";

const TransactionsHistory = () => {
  const today = new Date().toISOString().slice(0, 10);
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .slice(0, 10);

  // State variables
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPagePurchases, setCurrentPagePurchases] = useState(0);
  const [currentPageSales, setCurrentPageSales] = useState(0);
  const [purchases, setPurchases] = useState<PageResponse<PurchaseRecord>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
    size: 0,
    first: false,
    last: false,
  });
  const [sales, setSales] = useState<PageResponse<SaleRecord>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
    size: 0,
    first: false,
    last: false,
  });
  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [profit, setProfit] = useState(0);
  const [profitPeriod, setProfitPeriod] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatisticsDto[]>([]);
  const [yearlyStats, setYearlyStats] = useState<YearlyStatisticsDTO[]>([]);
  const [purchaseMonthlyStats, setPurchaseMonthlyStats] = useState<
    MonthlyStatisticsDto[]
  >([]);
  const [saleMonthlyStats, setSaleMonthlyStats] = useState<
    MonthlyStatisticsDto[]
  >([]);
  const [purchaseYearlyStats, setPurchaseYearlyStats] = useState<
    YearlyStatisticsDTO[]
  >([]);
  const [saleYearlyStats, setSaleYearlyStats] = useState<YearlyStatisticsDTO[]>(
    []
  );
  const [viewMode, setViewMode] = useState<"yearly" | "monthly">("monthly");
  const [selectedType, setSelectedType] = useState<"purchases" | "sellings">(
    "purchases"
  );
  const [statView, setStatView] = useState<"simple" | "graph">("simple");

  // Reset pagination when switching types
  useEffect(() => {
    if (selectedType === "purchases") {
      setCurrentPageSales(0);
    } else if (selectedType === "sellings") {
      setCurrentPagePurchases(0);
    }
    setCurrentPage(0); // Reset current page when type changes
  }, [selectedType]);

  // Load initial data on component mount
  useEffect(() => {
    loadTransactions();
    if (viewMode === "monthly") {
      loadPurchaseMonthlyStatistics(startDate, endDate);
      loadSaleMonthlyStatistics(startDate, endDate);
    } else {
      loadPurchaseYearlyStatistics(selectedYear);
      loadSaleYearlyStatistics(selectedYear);
    }
  }, []);

  // Adjust startDate when switching to monthly view
  useEffect(() => {
    if (viewMode === "monthly") {
      setStartDate(firstDayOfMonth);
      setEndDate(today);
    }
  }, [viewMode]);

  // Reload transactions and statistics when relevant state changes
  useEffect(() => {
    if (startDate && endDate) {
      loadTransactions();
      if (viewMode === "monthly") {
        loadPurchaseMonthlyStatistics(startDate, endDate);
        loadSaleMonthlyStatistics(startDate, endDate);
      }
    }
  }, [startDate, endDate, selectedType, currentPage]);

  useEffect(() => {
    if (viewMode === "yearly") {
      loadPurchaseYearlyStatistics(selectedYear);
      loadSaleYearlyStatistics(selectedYear);
    }
  }, [selectedYear, viewMode]);

  // Update display statistics based on selected type
  useEffect(() => {
    if (viewMode === "monthly") {
      if (selectedType === "purchases") {
        setMonthlyStats(purchaseMonthlyStats);
      } else {
        setMonthlyStats(saleMonthlyStats);
      }
    } else {
      if (selectedType === "purchases") {
        setYearlyStats(purchaseYearlyStats);
      } else {
        setYearlyStats(saleYearlyStats);
      }
    }
  }, [
    viewMode,
    selectedType,
    purchaseMonthlyStats,
    saleMonthlyStats,
    purchaseYearlyStats,
    saleYearlyStats,
  ]);

  // Fetch functions
  const loadTransactions = async () => {
    setError("");
    setLoading(true);
    try {
      if (selectedType === "purchases") {
        const data = await getPurchases(currentPage, 10, startDate, endDate);
        setPurchases(data);
      } else {
        const data = await getSales(currentPage, 10, startDate, endDate);
        setSales(data);
      }
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchaseMonthlyStatistics = async (
    startDate: string,
    endDate: string
  ) => {
    setError("");
    setLoading(true);
    try {
      const data = await getMonthlyStatistics(startDate, endDate, "purchases");
      setPurchaseMonthlyStats(data);
    } catch (err) {
      setError("Failed to load purchase monthly statistics");
      console.error("Error loading purchase monthly statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSaleMonthlyStatistics = async (
    startDate: string,
    endDate: string
  ) => {
    setError("");
    setLoading(true);
    try {
      const data = await getMonthlyStatistics(startDate, endDate, "sellings");
      setSaleMonthlyStats(data);
    } catch (err) {
      setError("Failed to load sale monthly statistics");
      console.error("Error loading sale monthly statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchaseYearlyStatistics = async (year: number) => {
    setError("");
    setLoading(true);
    try {
      const data = await getYearlyStatistics(year, "purchases");
      setPurchaseYearlyStats(data);
    } catch (err) {
      setError("Failed to load purchase yearly statistics");
      console.error("Error loading purchase yearly statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSaleYearlyStatistics = async (year: number) => {
    setError("");
    setLoading(true);
    try {
      const data = await getYearlyStatistics(year, "sellings");
      setSaleYearlyStats(data);
    } catch (err) {
      setError("Failed to load sale yearly statistics");
      console.error("Error loading sale yearly statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate profit using separate purchase and sale statistics
  const calculateProfit = () => {
    let totalPurchases = 0;
    let totalSales = 0;

    if (viewMode === "monthly") {
      totalPurchases = purchaseMonthlyStats.reduce(
        (sum, stat) => sum + (stat.totalSpent || 0),
        0
      );
      totalSales = saleMonthlyStats.reduce(
        (sum, stat) => sum + (stat.totalRevenue || 0),
        0
      );
    } else {
      totalPurchases = purchaseYearlyStats.reduce(
        (sum, stat) => sum + (stat.totalPurchaseCost || 0),
        0
      );
      totalSales = saleYearlyStats.reduce(
        (sum, stat) => sum + (stat.totalSalesRevenue || 0),
        0
      );
    }

    const calculatedProfit = totalSales - totalPurchases;

    setProfitPeriod(viewMode === "monthly" ? "Periudhe" : "Vitin");
    setProfit(calculatedProfit);
    setIsProfitModalOpen(true);
  };

  const statsData = viewMode === "monthly" ? monthlyStats : yearlyStats;

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            {viewMode === "monthly" && (
              <div className="relative">
                <div className="flex flex-col">
                  <label className="mb-1 font-extrabold">Dita fillestare</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-6"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-extrabold">
                    Dita perfundimtare
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
            {viewMode === "yearly" && (
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-24"
              />
            )}
          </div>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                value="monthly"
                checked={viewMode === "monthly"}
                onChange={() => setViewMode("monthly")}
                className="mr-2"
              />
              Periudhe
            </label>
            <label>
              <input
                type="radio"
                value="yearly"
                checked={viewMode === "yearly"}
                onChange={() => setViewMode("yearly")}
                className="mr-2"
              />
              Vjetore
            </label>
          </div>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                value="purchases"
                checked={selectedType === "purchases"}
                onChange={() => setSelectedType("purchases")}
                className="mr-2"
              />
              Blerjet
            </label>
            <label>
              <input
                type="radio"
                value="sellings"
                checked={selectedType === "sellings"}
                onChange={() => setSelectedType("sellings")}
                className="mr-2"
              />
              Shitjet
            </label>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="simple"
              checked={statView === "simple"}
              onChange={() => setStatView("simple")}
              className="mr-2"
            />
            Statistikë e thjeshtë
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="graph"
              checked={statView === "graph"}
              onChange={() => setStatView("graph")}
              className="mr-2"
            />
            Statistikë me grafikë
          </label>
        </div>
        <div className="flex items-center">
          <button
            onClick={calculateProfit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Shfaq Fitimin/Humbjen
          </button>
        </div>
        <ProfitLossModal
          isOpen={isProfitModalOpen}
          onClose={() => setIsProfitModalOpen(false)}
          profit={profit}
          period={profitPeriod}
        />
      </div>

      {/* Statistics Section */}
      {statView === "simple" && viewMode === "monthly" && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold mb-2">Statistikat</h3>
          {monthlyStats.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkti
                  </th>
                  {selectedType === "purchases" && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Blerjes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Shpenzimeve
                      </th>
                    </>
                  )}
                  {selectedType === "sellings" && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Shitjeve
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Xhiros
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyStats.map((stat) => (
                  <tr key={stat.productName}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.productName}
                    </td>
                    {selectedType === "purchases" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.totalBought}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {stat.totalSpent.toFixed(2)}
                        </td>
                      </>
                    )}
                    {selectedType === "sellings" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.totalSold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {stat.totalRevenue.toFixed(2)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Shuma
                  </td>
                  {selectedType === "purchases" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {monthlyStats.reduce(
                          (sum, stat) => sum + stat.totalBought,
                          0
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Lek{" "}
                        {monthlyStats
                          .reduce((sum, stat) => sum + stat.totalSpent, 0)
                          .toFixed(2)}
                      </td>
                    </>
                  )}
                  {selectedType === "sellings" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {monthlyStats.reduce(
                          (sum, stat) => sum + stat.totalSold,
                          0
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Lek{" "}
                        {monthlyStats
                          .reduce((sum, stat) => sum + stat.totalRevenue, 0)
                          .toFixed(2)}
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="text-gray-500">No transactions for this month</div>
          )}
        </div>
      )}
      {statView === "graph" && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold mb-2">
            Grafik i {viewMode === "monthly" ? "Mujore" : "Vjetore"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={statsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={
                  viewMode === "yearly"
                    ? selectedType === "purchases"
                      ? "yearlyPurchases"
                      : "yearlySales"
                    : selectedType === "purchases"
                    ? "totalBought"
                    : "totalSold"
                }
                fill="#4F46E5"
                name={selectedType === "purchases" ? "Blerjet" : "Shitjet"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {viewMode === "yearly" && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold mb-2">Statistikat Vjetore</h3>
          {yearlyStats.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkti
                  </th>
                  {selectedType === "purchases" && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Blerjeve
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Shpenzimeve
                      </th>
                    </>
                  )}
                  {selectedType === "sellings" && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Shitjeve
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Xhiros
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yearlyStats.map((stat) => (
                  <tr key={stat.productName}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.productName}
                    </td>
                    {selectedType === "purchases" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.yearlyPurchases}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {stat.totalPurchaseCost.toFixed(2)}
                        </td>
                      </>
                    )}
                    {selectedType === "sellings" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.yearlySales}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {stat.totalSalesRevenue.toFixed(2)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Shuma
                  </td>
                  {selectedType === "purchases" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {yearlyStats.reduce(
                          (sum, stat) => sum + stat.yearlyPurchases,
                          0
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Lek{" "}
                        {yearlyStats
                          .reduce(
                            (sum, stat) => sum + stat.totalPurchaseCost,
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </>
                  )}
                  {selectedType === "sellings" && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {yearlyStats.reduce(
                          (sum, stat) => sum + stat.yearlySales,
                          0
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Lek{" "}
                        {yearlyStats
                          .reduce(
                            (sum, stat) => sum + stat.totalSalesRevenue,
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="text-gray-500">No transactions for this year</div>
          )}
        </div>
      )}

      {/* Transactions Table */}
      {viewMode === "monthly" && monthlyStats.length > 0 && (
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">
            {selectedType === "purchases" ? "Blerjet" : "Shitjet"}
          </h3>
          {selectedType === "purchases" && purchases.content.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produkti
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sasia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cmimi per Njesi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cmimi Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.content.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.buyingDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {record.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {record.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((curr) => Math.max(0, curr - 1))
                    }
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Pas
                  </button>
                  <button
                    onClick={() => setCurrentPage((curr) => curr + 1)}
                    disabled={currentPage >= purchases.totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Para
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage + 1}</span> of{" "}
                      <span className="font-medium">
                        {purchases.totalPages}
                      </span>
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((curr) => Math.max(0, curr - 1))
                        }
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage((curr) => curr + 1)}
                        disabled={currentPage >= purchases.totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          ) : (
            selectedType === "purchases" && (
              <div className="text-gray-500">
                No transactions for this month
              </div>
            )
          )}
          {selectedType === "sellings" && sales.content.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produkti
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sasia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cmimi per Njesi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totali i Xhiros
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sales.content.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.sellingDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {record.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek {record.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((curr) => Math.max(0, curr - 1))
                    }
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Pas
                  </button>
                  <button
                    onClick={() => setCurrentPage((curr) => curr + 1)}
                    disabled={currentPage >= sales.totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Para
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage + 1}</span> of{" "}
                      <span className="font-medium">{sales.totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((curr) => Math.max(0, curr - 1))
                        }
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage((curr) => curr + 1)}
                        disabled={currentPage >= sales.totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionsHistory;
