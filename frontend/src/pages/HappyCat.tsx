import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, TrendingUp, Globe, Trophy } from "lucide-react";

// ── Static data ──────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  const color =
    rank === 1
      ? "bg-amber-400"
      : rank === 2
        ? "bg-slate-400"
        : rank === 3
          ? "bg-orange-500"
          : "bg-teal-700";
  return (
    <div
      className={`w-7 h-7 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold shrink-0`}
    >
      {rank}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HappyCat() {
  const [trendCountry, setTrendCountry] = useState("Finland");
  const [trendPeriod, setTrendPeriod] = useState("7 Years");
  const [compareA, setCompareA] = useState("Finland");
  const [compareB, setCompareB] = useState("Denmark");
  const [rankYear, setRankYear] = useState("2024");
  const [rankRegion, setRankRegion] = useState("All Regions");

  // Backend states
  const [availableCountries, setAvailableCountries] = useState<string[]>([
    "Finland",
    "Denmark",
    "Switzerland",
    "Germany",
  ]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [metricsA, setMetricsA] = useState<any>({});
  const [metricsB, setMetricsB] = useState<any>({});
  const [rankingsData, setRankingsData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const API_BASE = "http://localhost:3001/countries";

  // Fetch Rankings & Available Countries
  useEffect(() => {
    fetch(`${API_BASE}/rankings?year=${rankYear}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRankingsData(
            data.map((d: any) => ({
              rank: d.rank_in_year,
              country: d.country,
              region: "Global",
              score: Number(d.happiness_score),
            })),
          );
          const countries = data.map((d: any) => d.country);
          if (countries.length > 0) {
            setAvailableCountries([...new Set(countries)].sort());
          }
          setPage(1); // Zurück zur ersten Seite beim Jahreswechsel
        }
      })
      .catch((err) => console.error("Error fetching rankings:", err));
  }, [rankYear]);

  // Fetch Trend Data
  useEffect(() => {
    fetch(`${API_BASE}/${trendCountry}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const years = parseInt(trendPeriod);
          const sliced = data.slice(-years);
          setTrendData(
            sliced.map((d: any) => ({
              year: String(d.year),
              score: Number(d.happiness_score),
            })),
          );
        }
      })
      .catch((err) => console.error("Error fetching trend:", err));
  }, [trendCountry, trendPeriod]);

  // Fetch Comparison Data
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/${compareA}/history`).then((r) => r.json()),
      fetch(`${API_BASE}/${compareB}/history`).then((r) => r.json()),
    ])
      .then(([dataA, dataB]) => {
        if (Array.isArray(dataA) && Array.isArray(dataB)) {
          const map: Record<string, any> = {};
          dataA.forEach((d: any) => {
            map[d.year] = {
              year: String(d.year),
              scoreA: Number(d.happiness_score),
            };
          });
          dataB.forEach((d: any) => {
            if (!map[d.year]) map[d.year] = { year: String(d.year) };
            map[d.year].scoreB = Number(d.happiness_score);
          });
          const merged = Object.values(map).sort(
            (a, b) => Number(a.year) - Number(b.year),
          );
          setComparisonData(merged);

          const latestA = dataA[dataA.length - 1];
          if (latestA)
            setMetricsA({
              gdp: Number(latestA.gdp_per_capita).toFixed(3),
              social: Number(latestA.social_support).toFixed(3),
              life: Number(latestA.healthy_life_expectancy).toFixed(2) + " yrs",
              corruption: Number(latestA.perceptions_of_corruption).toFixed(3),
            });

          const latestB = dataB[dataB.length - 1];
          if (latestB)
            setMetricsB({
              gdp: Number(latestB.gdp_per_capita).toFixed(3),
              social: Number(latestB.social_support).toFixed(3),
              life: Number(latestB.healthy_life_expectancy).toFixed(2) + " yrs",
              corruption: Number(latestB.perceptions_of_corruption).toFixed(3),
            });
        }
      })
      .catch((err) => console.error("Error fetching comparison:", err));
  }, [compareA, compareB]);

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(rankingsData.length / itemsPerPage);
  const paginatedRankings = rankingsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200  py-3 flex items-center justify-around">
        <div className="flex items-center gap-2.5">
          {/* Use Vite/React's import for static assets */}
          <img
            src="/src/assets/happyCat_logo.png"
            alt="HappyCat"
            className="w-25"
          />
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold text-stone-800">
            World Happiness Report Dashboard
          </h1>
          <p className="text-xs text-stone-500">
            Track and compare global happiness metrics across countries and time
            periods
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="p-5">
        <div className="grid grid-cols-[3fr_2fr] gap-5 max-w-[1400px] mx-auto">
          {/* Left column */}
          <div className="space-y-5">
            {/* Happiness Trends */}
            <Card className="shadow-sm">
              <CardHeader className="pb-0 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-stone-700">
                    <TrendingUp size={16} className="text-teal-600" /> Happiness Trends
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={trendCountry}
                      onValueChange={setTrendCountry}
                    >
                      <SelectTrigger className="h-8 w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={trendPeriod} onValueChange={setTrendPeriod}>
                      <SelectTrigger className="h-8 w-28 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 Years">3 Years</SelectItem>
                        <SelectItem value="5 Years">5 Years</SelectItem>
                        <SelectItem value="7 Years">7 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 px-2 pb-4">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      ticks={[0, 3, 6, 10]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e7e5e4",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(v) => [
                        typeof v === "number" ? v.toFixed(2) : v,
                        trendCountry,
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name={trendCountry}
                      stroke="#0d9488"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#0d9488", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Country Comparison */}
            <Card className="shadow-sm">
              <CardHeader className="pb-0 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-stone-700">
                    <Globe size={16} className="text-blue-500" /> Country Comparison
                  </div>
                  <div className="flex gap-2">
                    <Select value={compareA} onValueChange={setCompareA}>
                      <SelectTrigger className="h-8 w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={compareB} onValueChange={setCompareB}>
                      <SelectTrigger className="h-8 w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <div className="grid grid-cols-[3fr_2fr] gap-4">
                  {/* Chart */}
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={comparisonData}
                        margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          domain={[0, 10]}
                          ticks={[0, 3, 6, 10]}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e7e5e4",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="scoreA"
                          name={compareA}
                          stroke="#0d9488"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#0d9488", strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="scoreB"
                          name={compareB}
                          stroke="#f97316"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="flex gap-5 mt-1 px-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-5 h-0.5 bg-teal-600 rounded" />
                        {compareA}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-5 h-0.5 bg-orange-500 rounded" />
                        {compareB}
                      </span>
                    </div>
                  </div>

                  {/* Metrics table */}
                  <div className="text-sm">
                    <div className="grid grid-cols-3 gap-x-3 pb-1.5 border-b border-stone-200 font-medium">
                      <span className="text-stone-500 text-xs">Metric</span>
                      <span className="text-teal-600 text-xs text-right">
                        {compareA}
                      </span>
                      <span className="text-orange-500 text-xs text-right">
                        {compareB}
                      </span>
                    </div>
                    {[
                      {
                        label: "GDP per Capita",
                        a: metricsA?.gdp ?? "-",
                        b: metricsB?.gdp ?? "-",
                      },
                      {
                        label: "Social Support",
                        a: metricsA?.social ?? "-",
                        b: metricsB?.social ?? "-",
                      },
                      {
                        label: "Life Expectancy",
                        a: metricsA?.life ?? "-",
                        b: metricsB?.life ?? "-",
                      },
                      {
                        label: "Corruption",
                        a: metricsA?.corruption ?? "-",
                        b: metricsB?.corruption ?? "-",
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-3 gap-x-3 py-2 border-b border-stone-100 text-xs"
                      >
                        <span className="text-stone-600">{row.label}</span>
                        <span className="text-right text-stone-700 font-medium">
                          {row.a}
                        </span>
                        <span className="text-right text-stone-700 font-medium">
                          {row.b}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column — Rankings */}
          <Card className="shadow-sm flex flex-col">
            <CardHeader className="pb-0 pt-4 px-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-semibold text-stone-700">
                  <Trophy size={16} className="text-amber-500" /> Country Rankings
                </div>
                <div className="flex gap-2">
                  <Select value={rankYear} onValueChange={setRankYear}>
                    <SelectTrigger className="h-8 w-24 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2011">2011</SelectItem>
                      <SelectItem value="2012">2012</SelectItem>
                      <SelectItem value="2014">2014</SelectItem>
                      <SelectItem value="2015">2015</SelectItem>
                      <SelectItem value="2016">2016</SelectItem>
                      <SelectItem value="2017">2017</SelectItem>
                      <SelectItem value="2018">2018</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={rankRegion} onValueChange={setRankRegion}>
                    <SelectTrigger className="h-8 w-32 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Regions">All Regions</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia">Asia</SelectItem>
                      <SelectItem value="Americas">Americas</SelectItem>
                      <SelectItem value="Africa">Africa</SelectItem>
                      <SelectItem value="Oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-5 pt-3 pb-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-stone-200">
                    <TableHead className="text-xs text-stone-500 w-12">
                      Rank
                    </TableHead>
                    <TableHead className="text-xs text-stone-500">
                      Country
                    </TableHead>
                    <TableHead className="text-xs text-stone-500">
                      Region
                    </TableHead>
                    <TableHead className="text-xs text-stone-500 text-right">
                      Happiness Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRankings.map((row) => (
                    <TableRow key={row.rank} className="border-stone-100">
                      <TableCell className="py-2.5">
                        <RankBadge rank={row.rank} />
                      </TableCell>
                      <TableCell className="py-2.5 font-medium text-sm text-stone-800">
                        {row.country}
                      </TableCell>
                      <TableCell className="py-2.5 text-sm text-stone-400">
                        {row.region}
                      </TableCell>
                      <TableCell className="py-2.5 text-sm font-semibold text-stone-700 text-right tabular-nums">
                        {row.score.toFixed(3)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {(() => {
                const pages: (number | "...")[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (page > 3) pages.push("...");
                  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
                  if (page < totalPages - 2) pages.push("...");
                  pages.push(totalPages);
                }
                return (
                  <div className="mt-auto pt-4 border-t border-stone-200 flex items-center justify-center gap-1 text-sm flex-wrap">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-200 text-stone-500 hover:bg-stone-100 hover:border-stone-300 hover:text-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    {pages.map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-stone-400">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded border font-medium transition-colors ${
                            page === p
                              ? "bg-teal-600 border-teal-600 text-white"
                              : "border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300 hover:text-stone-800"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || totalPages === 0}
                      className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-200 text-stone-500 hover:bg-stone-100 hover:border-stone-300 hover:text-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
