import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [scanMessage, setScanMessage] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('checked_in');
  const [hackerDetails, setHackerDetails] = useState(null);

  const categories = [
    { value: 'checked_in', label: 'Check In' },
    { value: 'swag', label: 'Swag Pickup' },
    { value: 'friday_dinner', label: 'Friday Dinner' },
    { value: 'saturday_breakfast', label: 'Saturday Breakfast' },
    { value: 'saturday_lunch', label: 'Saturday Lunch' },
    { value: 'saturday_dinner', label: 'Saturday Dinner' },
    { value: 'sunday_breakfast', label: 'Sunday Breakfast' }
  ];

  useEffect(() => {
    const createScanner = () => {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      setScanner(html5QrcodeScanner);
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    };

    createScanner();

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    try {
      // Assuming QR code contains the hacker ID
      const hackerId = decodedText;
      
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          hackerId, 
          category: selectedCategory 
        }),
      });
      
      const data = await response.json();
      
      // Get hacker details
      const hackerResponse = await fetch(`http://localhost:5000/api/hacker/${hackerId}`);
      const hackerData = await hackerResponse.json();
      
      setScanResult(hackerId);
      setIsExisting(data.exists);
      setScanMessage(data.message);
      setHackerDetails(hackerData);
      
      if (scanner) {
        scanner.pause();
      }
    } catch (error) {
      console.error('Error processing scan:', error);
      setScanMessage('Error processing scan');
    }
  };

  const onScanFailure = (error) => {
    console.warn(`QR code scan failed: ${error}`);
  };

  const handleReset = () => {
    setScanResult(null);
    setIsExisting(false);
    setScanMessage('');
    setHackerDetails(null);
    if (scanner) {
      scanner.resume();
    }
  };

  return (
    <div className="container">
      <div className="scanner-container">
        <h2 className="title">Hackathon Scanner</h2>
        
        <div className="category-selector">
          <label>Select Scanning Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="scanner-grid">
          <div className="scanner-section">
            {!scanResult ? (
              <div id="qr-reader" className="reader-container" />
            ) : (
              <div className={`result-container ${isExisting ? 'existing' : 'new'}`}>
                {hackerDetails && (
                  <div className="hacker-details">
                    <h3>Hacker Details:</h3>
                    <p>Name: {hackerDetails.preferred_name || `${hackerDetails.first_name} ${hackerDetails.last_name}`}</p>
                    <p>Pronouns: {hackerDetails.pronouns}</p>
                    <p>Shirt Size: {hackerDetails.shirt_size}</p>
                    <p>Dietary Restrictions: {hackerDetails.dietary_restrictions}</p>
                  </div>
                )}
                <p className="status-text">{scanMessage}</p>
              </div>
            )}
            
            {scanResult && (
              <button
                onClick={handleReset}
                className="reset-button"
              >
                Scan Another Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;