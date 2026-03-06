import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import './BacentaServiceForm.css';

interface BacentaFormData {
  serviceDate: string;
  attendance: string;
  offering: string;
  foreignCurrency: string;
  treasures: string[];
  treasuresPicture: string;
  servicePicture: string;
}

const BacentaServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BacentaFormData>({
    serviceDate: '',
    attendance: '',
    offering: '',
    foreignCurrency: '',
    treasures: ['', ''],
    treasuresPicture: '',
    servicePicture: ''
  });
  const [treasureInput, setTreasureInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTreasureChange = (index: number, value: string) => {
    const newTreasures = [...formData.treasures];
    newTreasures[index] = value;
    setFormData(prev => ({ ...prev, treasures: newTreasures }));
  };

  const addTreasure = () => {
    if (treasureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        treasures: [...prev.treasures, treasureInput.trim()]
      }));
      setTreasureInput('');
    }
  };

  const removeTreasure = (index: number) => {
    if (formData.treasures.length > 2) {
      setFormData(prev => ({
        ...prev,
        treasures: prev.treasures.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bacenta Service Form Data:', formData);
    alert('Bacenta Service form submitted successfully!');
    navigate('/dashboard/services');
  };

  return (
    <div className="bacenta-form-page">
      <PageHeader title="Bacenta Service" />

      <form className="bacenta-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="serviceDate">
            Service Date <span className="required-mark">*</span>
          </label>
          <div className="input-with-icon">
            <FiCalendar className="input-icon" />
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              className="form-input with-icon"
              value={formData.serviceDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="attendance">
            Attendance <span className="required-mark">*</span>
          </label>
          <div className="input-with-icon">
            <FiUsers className="input-icon" />
            <input
              type="number"
              id="attendance"
              name="attendance"
              className="form-input with-icon"
              placeholder="Number of attendees"
              value={formData.attendance}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="offering">
            Offering (GHc) <span className="required-mark">*</span>
          </label>
          <div className="input-with-icon">
            <FiDollarSign className="input-icon" />
            <input
              type="number"
              id="offering"
              name="offering"
              className="form-input with-icon"
              placeholder="0.00"
              value={formData.offering}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="foreignCurrency">
            Foreign Currency Amount (Optional)
          </label>
          <div className="input-with-icon">
            <FiDollarSign className="input-icon" />
            <input
              type="number"
              id="foreignCurrency"
              name="foreignCurrency"
              className="form-input with-icon"
              placeholder="0.00"
              value={formData.foreignCurrency}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Treasures (at least 2) <span className="required-mark">*</span>
          </label>
          <div className="treasures-list">
            {formData.treasures.map((treasure, index) => (
              <div key={index} className="treasure-item">
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Treasure ${index + 1}`}
                  value={treasure}
                  onChange={(e) => handleTreasureChange(index, e.target.value)}
                  required={index < 2}
                />
                {formData.treasures.length > 2 && (
                  <button
                    type="button"
                    className="btn-remove-treasure"
                    onClick={() => removeTreasure(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="add-treasure-row">
            <input
              type="text"
              className="form-input"
              placeholder="Add another treasure"
              value={treasureInput}
              onChange={(e) => setTreasureInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTreasure())}
            />
            <button type="button" className="btn-add-treasure" onClick={addTreasure}>
              Add
            </button>
          </div>
        </div>

        <ImageUpload
          label="Treasures Picture"
          value={formData.treasuresPicture}
          onChange={(imageData) => setFormData(prev => ({ ...prev, treasuresPicture: imageData }))}
          required
        />

        <ImageUpload
          label="Service Picture"
          value={formData.servicePicture}
          onChange={(imageData) => setFormData(prev => ({ ...prev, servicePicture: imageData }))}
          required
        />

        <button type="submit" className="btn-submit">
          Submit Bacenta Service
        </button>
      </form>
    </div>
  );
};

export default BacentaServiceForm;
