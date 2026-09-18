import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { Toast } from 'antd-mobile';
import PageHeader from '../../components/PageHeader/PageHeader';
import { fetchBacentas, Bacenta } from '../../api/bacentas';
import { createArrival } from '../../api/arrivals';
import './FillArrivalsForm.css';

const FillArrivalsForm: React.FC = () => {
    const navigate = useNavigate();
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"

    const [bacentas, setBacentas] = useState<Bacenta[]>([]);
    const [loadingBacentas, setLoadingBacentas] = useState(true);

    const [selectedBacentaId, setSelectedBacentaId] = useState<string>('');
    const [date, setDate] = useState<string>(todayStr);
    const [arrivalTime, setArrivalTime] = useState<string>(nowTimeStr);
    const [numberBussed, setNumberBussed] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadBacentas = async () => {
            try {
                const data = await fetchBacentas();
                setBacentas(data);
                if (data.length > 0) {
                    setSelectedBacentaId(data[0].id.toString());
                }
            } catch (err) {
                console.error('Failed to load bacentas:', err);
                Toast.show({
                    icon: 'fail',
                    content: 'Failed to load bacentas. Please refresh.',
                });
            } finally {
                setLoadingBacentas(false);
            }
        };

        loadBacentas();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        if (!selectedBacentaId) {
            Toast.show({
                icon: 'fail',
                content: 'Please select a Bacenta',
            });
            return;
        }

        const bussedCount = parseInt(numberBussed, 10);
        if (isNaN(bussedCount) || bussedCount < 0) {
            Toast.show({
                icon: 'fail',
                content: 'Please enter a valid number of people bussed',
            });
            return;
        }

        setSubmitting(true);
        try {
            await createArrival({
                bacenta_id: Number(selectedBacentaId),
                date,
                time: arrivalTime,
                number_bussed: bussedCount,
            });

            Toast.show({
                icon: 'success',
                content: 'Arrivals form submitted successfully!',
            });
            navigate('/dashboard/arrivals');
        } catch (err: any) {
            console.error('Error submitting arrivals form:', err);
            Toast.show({
                icon: 'fail',
                content: err.response?.data?.message || 'Failed to submit form. Please try again.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="arrivals-form-page">
            <PageHeader title="Fill Arrivals Form" />

            <form className="arrivals-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="bacentaSelect">
                        Bacenta <span className="required-mark">*</span>
                    </label>
                    <div className="input-with-icon">
                        <FiMapPin className="input-icon" />
                        {loadingBacentas ? (
                            <div className="form-input loading-placeholder">Loading bacentas...</div>
                        ) : (
                            <select
                                id="bacentaSelect"
                                className="form-input with-icon"
                                value={selectedBacentaId}
                                onChange={(e) => setSelectedBacentaId(e.target.value)}
                                required
                            >
                                {bacentas.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name} {b.region ? `(${b.region.name})` : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="arrivalDate">
                        Date <span className="required-mark">*</span>
                    </label>
                    <div className="input-with-icon">
                        <FiCalendar className="input-icon" />
                        <input
                            type="date"
                            id="arrivalDate"
                            className="form-input with-icon"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="arrivalTime">
                        Arrival Time <span className="required-mark">*</span>
                    </label>
                    <div className="input-with-icon">
                        <FiClock className="input-icon" />
                        <input
                            type="time"
                            id="arrivalTime"
                            className="form-input with-icon"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="numberBussed">
                        Number of People Bussed <span className="required-mark">*</span>
                    </label>
                    <div className="input-with-icon">
                        <FiUsers className="input-icon" />
                        <input
                            type="number"
                            id="numberBussed"
                            className="form-input with-icon"
                            placeholder="e.g. 15"
                            value={numberBussed}
                            onChange={(e) => setNumberBussed(e.target.value)}
                            required
                            min="0"
                        />
                    </div>
                </div>

                <button type="submit" className="btn-submit" disabled={submitting || loadingBacentas || bacentas.length === 0}>
                    {submitting ? (
                        <>
                            <FiLoader className="spinner" /> Submitting...
                        </>
                    ) : (
                        'Submit Arrivals'
                    )}
                </button>
            </form>
        </div>
    );
};

export default FillArrivalsForm;
