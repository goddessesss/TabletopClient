import React, { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs.jsx';
import GameClubGrid from '../components/GameClubs/GameClubGrid.jsx';
import { getAllGameClubs } from '../api/gameClubsApi.js';
import { useNotifications } from '../components/NotificationsHandling/NotificationContext.jsx';

function GameClubs() {
    const { addNotification } = useNotifications();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClubs() {
            const result = await getAllGameClubs();
            if (result.success) {
                setClubs(result.data);
            } else {
                addNotification({message: 'Failed to load game clubs. Please try again later.', variant:'danger'})
            }
            setLoading(false);
        }

        fetchClubs();
    }, []);

    return (
        <div className="container my-2" style={{ position: 'relative', minHeight:'87vh' }}>
            
            <div className="pt-4">
            <BreadCrumbs
                items={[
                    { label: 'Home', path: '/' },
                    { label: 'Game Clubs' }
                ]}
            />
            </div>
    
            <h1 className="fw-bold mb-2 px-2">Game Clubs</h1>
            <p className="px-2 fs-4">Discover board game clubs near you and enjoy meaningful tabletop experience</p>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <GameClubGrid clubs={clubs} />
            )}
        </div>
    )
}

export default GameClubs;