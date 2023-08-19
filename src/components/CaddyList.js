import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import logo from '../styles/KotaPermai (R).JPG';
import '../styles/css/CaddyList.css';

function CaddyList() {
    const history = useHistory();
    const [caddies, setCaddies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { receipt } = useParams();

    const handleRateNowClick = (chitId, caddyNo, name) => {
        console.log('Rate Now button clicked for caddy:', caddyNo, chitId);
        history.push(`/rating-form/${receipt}/${chitId}/${caddyNo}/${name}`); // Navigate to the rating page
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const receipt = window.location.pathname.split('/').pop();
                const apiUrl = `https://localhost:7089/api/caddy/GetCaddiesByReceipt/${receipt}`;
                const response = await axios.get(apiUrl);

                console.log(response.data);

                setCaddies(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error fetching caddies');
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    console.log("Caddies:", caddies);

    return (
        <div className="landing-page">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">Caddie List for Receipt: {receipt}</h1>
            {loading ? (
                <p>Loading caddies...</p>
            ) : (
                <ul className="caddies-list">
                    {caddies.map((caddy) => (
                        <li className="caddie-item" key={caddy.caddyNo}>
                            <span className="caddie-name">{caddy.name}</span>
                            <span className={`assessment ${caddy.assessment === 0 ? 'no-rating' : 'rating-given'}`}>
                                <span>{caddy.chitId}</span>
                                {caddy.assessment === 0 ? (
                                    <button onClick={() => handleRateNowClick(caddy.chitID, caddy.caddyNo, caddy.name)}>Rate Now</button>
                                ) : (
                                    <span>Rating Given</span>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CaddyList;
