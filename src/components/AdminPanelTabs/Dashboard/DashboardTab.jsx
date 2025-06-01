import React, { useState, useEffect } from 'react';
import { getOverallStatistics } from '../../../api/statisticsApi';
import EventTypePieChart from './EventTypePieChart';
import EventPlayersBarChart from './EventPlayersBarChart';


function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await getOverallStatistics();
      if (res.success) {
        setStats(res.data);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  if (error || !stats) {
    return <p className="text-danger">Failed to load statistics.</p>;
  }

  return (
    <div className = "dashboards">
        <div className = "overall-statistics">
            <h3 className="mb-4 mt-4"> Overall statistics</h3>
            <div className="cards">
                <div className="card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="card">
                    <h3>Games Listed</h3>
                    <p>{stats.totalGames}</p>
                </div>
                <div className="card">
                    <h3>Created Events</h3>
                    <p>{stats.totalEvents}</p>
                </div>
            </div>
        </div>
        <div className='d-flex mb-4 mt-5'>
            <div className = "event-types-statistics flex-grow-1">
                <h3>Event Type Distribution</h3>
                <EventTypePieChart></EventTypePieChart>
            </div>
            <div className = "event-types-statistics flex-grow-1">
                <h3>Event Players Distribution</h3>
                <EventPlayersBarChart></EventPlayersBarChart>
            </div>
        </div>
    </div>
  );
}

export default DashboardTab;
