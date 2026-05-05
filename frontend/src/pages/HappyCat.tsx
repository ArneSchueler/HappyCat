import { useState } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Static data ──────────────────────────────────────────────────────────────

const trendData = [
  { year: "2018", score: 7.63 },
  { year: "2019", score: 7.77 },
  { year: "2020", score: 7.81 },
  { year: "2021", score: 7.84 },
  { year: "2022", score: 7.82 },
  { year: "2023", score: 7.80 },
  { year: "2024", score: 7.74 },
];

const comparisonData = [
  { year: "2018", scoreA: 7.63, scoreB: 7.55 },
  { year: "2019", scoreA: 7.77, scoreB: 7.60 },
  { year: "2020", scoreA: 7.81, scoreB: 7.65 },
  { year: "2021", scoreA: 7.84, scoreB: 7.62 },
  { year: "2022", scoreA: 7.82, scoreB: 7.58 },
  { year: "2023", scoreA: 7.80, scoreB: 7.58 },
  { year: "2024", scoreA: 7.74, scoreB: 7.59 },
];

const countryMetrics: Record<string, { gdp: string; social: string; life: string; corruption: string }> = {
  Finland:     { gdp: "$53,982", social: "0.954", life: "81.7 yrs", corruption: "0.195" },
  Denmark:     { gdp: "$68,300", social: "0.949", life: "80.9 yrs", corruption: "0.180" },
  Switzerland: { gdp: "$91,930", social: "0.942", life: "83.4 yrs", corruption: "0.185" },
  Iceland:     { gdp: "$78,020", social: "0.983", life: "82.9 yrs", corruption: "0.172" },
  Netherlands: { gdp: "$63,750", social: "0.939", life: "82.0 yrs", corruption: "0.198" },
  Norway:      { gdp: "$89,090", social: "0.954", life: "82.4 yrs", corruption: "0.182" },
  Germany:     { gdp: "$48,720", social: "0.901", life: "81.3 yrs", corruption: "0.218" },
};

const rankingsData = [
  { rank: 1,  country: "Finland",     region: "Europe",  score: 7.804 },
  { rank: 2,  country: "Denmark",     region: "Europe",  score: 7.586 },
  { rank: 3,  country: "Switzerland", region: "Europe",  score: 7.559 },
  { rank: 4,  country: "Iceland",     region: "Europe",  score: 7.525 },
  { rank: 5,  country: "Netherlands", region: "Europe",  score: 7.464 },
  { rank: 6,  country: "Norway",      region: "Europe",  score: 7.392 },
  { rank: 7,  country: "Sweden",      region: "Europe",  score: 7.344 },
  { rank: 8,  country: "Luxembourg",  region: "Europe",  score: 7.122 },
  { rank: 9,  country: "New Zealand", region: "Oceania", score: 7.123 },
  { rank: 10, country: "Austria",     region: "Europe",  score: 7.097 },
];

function RankBadge({ rank }: { rank: number }) {
  const color =
    rank === 1 ? "bg-amber-400" :
    rank === 2 ? "bg-slate-400" :
    rank === 3 ? "bg-orange-500" :
    "bg-teal-700";
  return (
    <div className={`w-7 h-7 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
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

  const metricsA = countryMetrics[compareA] ?? countryMetrics.Finland;
  const metricsB = countryMetrics[compareB] ?? countryMetrics.Denmark;

  return (
    <div className="min-h-screen bg-stone-100">

      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center text-xl">
            🐱
          </div>
          <span className="font-bold text-lg text-stone-800">HappyCat</span>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold text-stone-800">World Happiness Report Dashboard</h1>
          <p className="text-xs text-stone-500">Track and compare global happiness metrics across countries and time periods</p>
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
                    📊 Happiness Trends
                  </div>
                  <div className="flex gap-2">
                    <Select value={trendCountry} onValueChange={setTrendCountry}>
                      <SelectTrigger className="h-8 w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(countryMetrics).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
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
                  <LineChart data={trendData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 10]} ticks={[0, 3, 6, 10]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e7e5e4", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v) => [typeof v === "number" ? v.toFixed(2) : v, trendCountry]}
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
                    🌍 Country Comparison
                  </div>
                  <div className="flex gap-2">
                    <Select value={compareA} onValueChange={setCompareA}>
                      <SelectTrigger className="h-8 w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(countryMetrics).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={compareB} onValueChange={setCompareB}>
                      <SelectTrigger className="h-8 w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(countryMetrics).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
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
                      <LineChart data={comparisonData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 10]} ticks={[0, 3, 6, 10]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", border: "1px solid #e7e5e4", borderRadius: "8px", fontSize: "12px" }}
                        />
                        <Line type="monotone" dataKey="scoreA" name={compareA} stroke="#0d9488" strokeWidth={2} dot={{ r: 4, fill: "#0d9488", strokeWidth: 0 }} />
                        <Line type="monotone" dataKey="scoreB" name={compareB} stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }} />
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
                      <span className="text-teal-600 text-xs text-right">{compareA}</span>
                      <span className="text-orange-500 text-xs text-right">{compareB}</span>
                    </div>
                    {[
                      { label: "GDP per Capita", a: metricsA.gdp,        b: metricsB.gdp },
                      { label: "Social Support", a: metricsA.social,     b: metricsB.social },
                      { label: "Life Expectancy", a: metricsA.life,      b: metricsB.life },
                      { label: "Corruption",      a: metricsA.corruption, b: metricsB.corruption },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-3 gap-x-3 py-2 border-b border-stone-100 text-xs">
                        <span className="text-stone-600">{row.label}</span>
                        <span className="text-right text-stone-700 font-medium">{row.a}</span>
                        <span className="text-right text-stone-700 font-medium">{row.b}</span>
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
                  🏆 Country Rankings
                </div>
                <div className="flex gap-2">
                  <Select value={rankYear} onValueChange={setRankYear}>
                    <SelectTrigger className="h-8 w-24 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
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
                    <TableHead className="text-xs text-stone-500 w-12">Rank</TableHead>
                    <TableHead className="text-xs text-stone-500">Country</TableHead>
                    <TableHead className="text-xs text-stone-500">Region</TableHead>
                    <TableHead className="text-xs text-stone-500 text-right">Happiness Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingsData.map((row) => (
                    <TableRow key={row.rank} className="border-stone-100">
                      <TableCell className="py-2.5">
                        <RankBadge rank={row.rank} />
                      </TableCell>
                      <TableCell className="py-2.5 font-medium text-sm text-stone-800">{row.country}</TableCell>
                      <TableCell className="py-2.5 text-sm text-stone-400">{row.region}</TableCell>
                      <TableCell className="py-2.5 text-sm font-semibold text-stone-700 text-right tabular-nums">
                        {row.score.toFixed(3)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-auto pt-4 border-t border-stone-200 flex items-center justify-center gap-2 text-sm">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors">
                  <ChevronLeft size={14} /> Previous
                </button>
                <button className="w-8 h-8 rounded border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors">
                  1
                </button>
                <button className="w-8 h-8 rounded bg-teal-600 text-white font-medium">
                  2
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
