import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getEventPlayersStatistics } from '../../../api/statisticsApi';

function EventPlayersBarChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await getEventPlayersStatistics();
      if (res.success) {
        const formatted = res.data.map(d => ({
          range: d.rangeStart === d.rangeEnd
            ? `${d.rangeStart}`
            : `${d.rangeStart}-${d.rangeEnd}`,
          eventsCount: d.eventsCount
        }));
        setData(formatted);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading bar chart...</p>;
  if (error || !data.length) return <p className="text-danger">Failed to load player statistics.</p>;

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" label={{ value: "Players per Event", position: 'insideBottom', dy: 10 }} />
          <YAxis allowDecimals={false} label={{ value: "Events Count", angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="eventsCount" name="Events" fill="#8884d8" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EventPlayersBarChart;