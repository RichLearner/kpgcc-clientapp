import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import logo from '../styles/KotaPermai (R).JPG';
import '../styles/css/RatingForm.css';

const RatingForm = ({ match }) => {
    //const apiUrl = "http://kpgccapp-dev.ap-southeast-1.elasticbeanstalk.com";
    const apiUrl = "https://localhost:7089";
    const history = useHistory();
    const { receipt, chitId, caddyId, name } = useParams();

    const [assessmentData, setAssessmentData] = useState([]);
    const [ratings, setRatings] = useState({});
    const [remarks, setRemarks] = useState('');

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
    };

    const assessmentValueMap = {
        poor: 1,
        average: 2,
        good: 3,
        excellent: 4,
    };

    useEffect(() => {
        // Fetch assessment data from the backend
        const fetchCaddyAssessment = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/caddy/${chitId}/${caddyId}`);
                console.log(response.data);
                setAssessmentData(response.data);
            } catch (error) {
                console.error('Error fetching caddy assessment:', error);
            }
        };

        fetchCaddyAssessment();
    }, [chitId, caddyId]);

    useEffect(() => {
        // Set the initial state of ratings to "excellent" for each assessment
        const initialRatings = assessmentData.reduce((acc, assessment) => {
            acc[assessment.assessID] = 'excellent';
            return acc;
        }, {});

        setRatings(initialRatings);
        console.log(ratings);
    }, [assessmentData]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("assessmentData:", assessmentData);

        const assessmentList = assessmentData.map((assessment) => ({
            ...assessment,
            assessment: assessmentValueMap[ratings[assessment.assessID]],
            caddyno: caddyId,
        }));

        const formData = {
            Type: 'GolfUpdateCaddyAssessment',
            Input: {
                ChitID: chitId,
                CaddyID: caddyId,
                CaddyAssessment: assessmentList,
                Remarks: remarks,
            },
        };

        try {
            // Send assessment data to the backend controller
            const postResponse = await axios.post(`${apiUrl}/api/caddy/post/Assessment`, formData);
            console.log('Assessment data updated successfully!', postResponse.data);

            // After successful submission, check if all caddies have been rated
            const checkResponse = await axios.get(`${apiUrl}/api/caddy/GetCaddiesByReceipt/${receipt}`);
            const unratedCaddies = checkResponse.data.filter(caddie => caddie.assessment === 0);

            if (unratedCaddies.length === 0) {
                // All caddies have been rated, navigate to Thank You page
                history.push('/thankyou'); // Change this path according to your route setup
            } else {
                // There are still unrated caddies, navigate back to Landing Page
                history.push(`/rate-caddies/${receipt}`); // Change this path according to your route setup
            }
        } catch (error) {
            console.error('Error while updating assessment data:', error);
            // Handle errors here, show an error message, etc.
        }
    };

    const handleRatingChange = (assessID, rating) => {
        setRatings((prevRatings) => ({ ...prevRatings, [assessID]: rating }));
    };

    return (
        <div className="container">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Caddie Rating</h1>
            <form onSubmit={handleSubmit}>
                {/* Display Assessment Categories and Radio Buttons */}
                <div className="header-table">
                    <div className="header-row">
                        <div className="header-cell">Caddie's Number</div>
                        <div className="header-cell">: {caddyId}</div>
                    </div>
                    <div className="header-row">
                        <div className="header-cell">Caddie's Name</div>
                        <div className="header-cell">: {name}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Excellent</th>
                            <th>Good</th>
                            <th>Average</th>
                            <th>Poor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessmentData.map((assessment) => (
                            <tr key={assessment.assessID}> 
                                <td className="assessment">{assessment.description}</td>
                                {['excellent', 'good', 'average', 'poor'].map((rating) => (
                                    <td key={rating}>
                                        <input
                                            type="radio"
                                            name={assessment.assessID}
                                            value={rating}
                                            checked={ratings[assessment.assessID] === rating}
                                            onChange={() => handleRatingChange(assessment.assessID, rating)}
                                            required
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Remark input */}
                <div className="input-group">
                    <label htmlFor="remarks">Remarks:</label>
                    <textarea
                        id="remarks"
                        value={remarks}
                        onChange={handleRemarksChange}
                        rows="4"
                        cols="50"
                        placeholder="Enter your remarks..."
                    ></textarea>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RatingForm;