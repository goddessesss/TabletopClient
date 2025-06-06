import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getEventTypesStatistics } from '../../../api/statisticsApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699'];

function EventTypePieChart() {
  const [data, setData] = useState([]);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await getEventTypesStatistics();
      if (res.success) {
        setData(res.data);
        setVisibleKeys(new Set(res.data.map(d => d.eventType)));
      } else {
        setError(true);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleVisibility = (eventType) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventType)) {
        newSet.delete(eventType);
      } else {
        newSet.add(eventType);
      }
      return newSet;
    });
  };

  const visibleData = data.filter(d => visibleKeys.has(d.eventType));
  const total = visibleData.reduce((acc, curr) => acc + curr.count, 0);

  if (loading) return <p>Loading chart...</p>;
  if (error || !data.length) return <p className="text-danger">Failed to load event statistics.</p>;

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={visibleData}
            dataKey="count"
            nameKey="eventType"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            label={({ eventType, count }) => {
              const percent = (count / total) * 100;
              return `${eventType}: ${percent.toFixed(0)}%`;
            }}
          >
            {visibleData.map((entry, index) => (
              <Cell key={`cell-${entry.eventType}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            payload={data.map((entry, index) => ({
              value: entry.eventType,
              id: entry.eventType,
              type: 'square',
              color: COLORS[index % COLORS.length],
              inactive: !visibleKeys.has(entry.eventType)
            }))}
            onClick={(e) => toggleVisibility(e.id)}
            wrapperStyle={{ cursor: 'pointer' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EventTypePieChart;