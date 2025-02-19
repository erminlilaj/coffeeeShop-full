import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

const TransactionsHistory = () => {
  // States for transactions
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
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // YYYY

  const albanianMonths = [
    "Janar",
    "Shkurt",
    "Mars",
    "Prill",
    "Maj",
    "Qershor",
    "Korrik",
    "Gusht",
    "Shtator",
    "Tetor",
    "Nëntor",
    "Dhjetor",
  ];
  // Function to get Albanian month name from YYYY-MM format
  const getAlbanianMonth = (dateString: string) => {
    const [year, month] = dateString.split("-");
    return `${albanianMonths[Number(month) - 1]} ${year}`; // Convert month index (1-based) to 0-based
  };

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatisticsDto[]>([]);
  const [yearlyStats, setYearlyStats] = useState<YearlyStatisticsDTO[]>([]);

  // viewMode can be 'monthly' or 'yearly'
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");

  // selectedType now only supports 'purchases' or 'sellings'
  const [selectedType, setSelectedType] = useState<"purchases" | "sellings">(
    "purchases"
  );

  // Load statistics when the month/year, viewMode, or selectedType changes
  useEffect(() => {
    if (viewMode === "monthly") {
      loadMonthlyStatistics();
    } else if (viewMode === "yearly") {
      loadYearlyStatistics();
    }
  }, [selectedMonth, selectedYear, viewMode, selectedType]);

  // Load transactions only if there are statistics to indicate transactions exist.
  useEffect(() => {
    // For monthly view, if there are aggregated stats then load the transactions.
    if (viewMode === "monthly" && monthlyStats.length > 0) {
      loadTransactions();
    }
    // For yearly view, you might choose not to show the full transactions list.
    // (Adjust this as needed. Here we only load transactions in monthly view.)
  }, [currentPage, selectedMonth, monthlyStats, selectedType, viewMode]);

  const loadTransactions = async () => {
    setError("");
    try {
      setLoading(true);
      if (selectedType === "purchases") {
        const data = await getPurchases(currentPage, 10, selectedMonth);
        setPurchases(data);
      } else {
        const data = await getSales(currentPage, 10, selectedMonth);
        setSales(data);
      }
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyStatistics = async () => {
    try {
      setLoading(true);
      const data = await getMonthlyStatistics(selectedMonth, selectedType);
      setMonthlyStats(data);
    } catch (err) {
      setError("Failed to load monthly statistics");
      console.error("Error loading monthly statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadYearlyStatistics = async () => {
    try {
      setLoading(true);
      const data = await getYearlyStatistics(selectedYear, selectedType);
      setYearlyStats(data);
    } catch (err) {
      setError("Failed to load yearly statistics");
      console.error("Error loading yearly statistics:", err);
    } finally {
      setLoading(false);
    }
  };
  const statsData = viewMode === "monthly" ? monthlyStats : yearlyStats;
  const [statView, setStatView] = useState<"simple" | "graph">("simple");

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
                {/* The actual input */}
                {selectedMonth && (
                  <div className="mt-1 text-l text-gray-600">
                    {getAlbanianMonth(selectedMonth)}
                  </div>
                )}
                <input
                  type="month"
                  value={selectedMonth} // Keep it as "YYYY-MM"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}

            {viewMode === "yearly" && (
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
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
              Mujore
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
      <div className="p-4 border-b border-gray-200 flex space-x-4">
        <label>
          <input
            type="radio"
            value="simple"
            checked={statView === "simple"}
            onChange={() => setStatView("simple")}
            className="mr-2"
          />
          Statistikë e thjeshtë
        </label>
        <label>
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

      {/* Statistics Section */}
      {statView === "simple" && viewMode === "monthly" && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold mb-2">Statistika Mujore</h3>
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
                          Lek &nbsp;
                          {stat.totalSpent.toFixed(2)}
                        </td>
                      </>
                    )}
                    {selectedType === "sellings" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.totalSold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek &nbsp;
                          {stat.totalRevenue.toFixed(2)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
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
                      : "yearlyProfit"
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
                        Total Purchased
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Purchase Cost
                      </th>
                    </>
                  )}
                  {selectedType === "sellings" && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Sales Revenue
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
                          Lek &nbsp;
                          {stat.totalPurchaseCost.toFixed(2)}
                        </td>
                      </>
                    )}
                    {selectedType === "sellings" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.yearlySales}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek &nbsp;
                          {stat.totalSalesRevenue.toFixed(2)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500">No transactions for this year</div>
          )}
        </div>
      )}

      {/* Transactions Table (only shown if statistics indicate there are transactions) */}
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
                          Lek &nbsp;
                          {record.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek &nbsp;
                          {record.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination for purchases */}
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
                        Pas
                      </button>
                      <button
                        onClick={() => setCurrentPage((curr) => curr + 1)}
                        disabled={currentPage >= purchases.totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Para
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No transactions for this month</div>
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
                          Lek &nbsp;
                          {record.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Lek &nbsp;
                          {record.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination for sales */}
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
                        Pas
                      </button>
                      <button
                        onClick={() => setCurrentPage((curr) => curr + 1)}
                        disabled={currentPage >= sales.totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Para
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
