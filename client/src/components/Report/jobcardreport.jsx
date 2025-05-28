
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import "./jobcardreport.css";
import { Modal, Button } from "react-bootstrap";

const JobcardReport = () => {
  const [allJobCards, setAllJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobCard, setSelectedJobCard] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllJobCardsData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_SERVER_URL}/api/job-cards/job-cards`
        );
        setAllJobCards(response.data);
      } catch (err) {
        console.error("Failed to fetch all job card data:", err);
        setError("Failed to load all job card reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobCardsData();
  }, []);

  const calculatePurityWeight = (weight, touch) => {
    const givenWeight = parseFloat(weight) || 0;
    const touchValue = parseFloat(touch) || 0;
    return (givenWeight * touchValue) / 100;
  };

  const handleViewJobCard = (jobCard) => {
    setSelectedJobCard(jobCard);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJobCard(null);
  };

  if (loading) {
    return <p className="loading-message">Loading all job card reports...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (allJobCards.length === 0) {
    return <p className="no-data-message">No job cards found.</p>;
  }

  return (
    <div className="jobcard-report-container">
      <h2 className="report-title">Job Card Reports</h2>

      <div className="legend">
        <strong>Legend:</strong>{" "}
        <span style={{ color: "green" }}>
          Green = Goldsmith should give balance to Owner
        </span>
        ,{" "}
        <span style={{ color: "red" }}>
          Red = Owner should give balance to Goldsmith
        </span>
      </div>

      <div className="table-responsive">
        <table className="jobcard-report-table">
          <thead>
            <tr>
              <th>SI.No</th>
              <th>Date</th>
              <th>Goldsmith Name</th>
              <th>Item Name</th>
              <th>Given Weight (g)</th>
              <th>Touch</th>
              <th>Given Weight (Purity)</th>
              <th>Product Weight</th>
              <th>Stone (g)</th>
              <th>Enamel (g)</th>
              <th>Beads (g)</th>
              <th>Final Weight (g)</th>
              <th>Wastage (g)</th>
              <th>Balance (g)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allJobCards.flatMap((jobCard, jobIndex) =>
              jobCard.items.map((item, itemIndex) => {
                const givenPurityWeight = calculatePurityWeight(
                  item.originalGivenWeight,
                  item.touch
                );
                const finalWeight = parseFloat(item.finalWeight || 0);
                const wastage = parseFloat(item.wastage || 0);
                const balance = givenPurityWeight - (finalWeight + wastage);

                const stoneWeight =
                  item.additionalWeights?.find((aw) => aw.name === "stone")
                    ?.weight || 0;
                const enamelWeight =
                  item.additionalWeights?.find((aw) => aw.name === "enamel")
                    ?.weight || 0;
                const beadsWeight =
                  item.additionalWeights?.find((aw) => aw.name === "beeds")
                    ?.weight || 0;

                return (
                  <tr key={`${jobCard.id}-${item.id || itemIndex}`}>
                    <td>
                      {jobIndex + 1}.{itemIndex + 1}
                    </td>
                    <td>
                      {new Date(jobCard.date).toISOString().split("T")[0]}
                    </td>
                    <td>{jobCard.goldsmith?.name || "N/A"}</td>
                    <td>{item.masterItem?.itemName || "N/A"}</td>
                    <td>{item.originalGivenWeight}</td>
                    <td>{item.touch || "-"}</td>
                    <td>{givenPurityWeight.toFixed(2)}</td>
                    <td>{item.finalWeight || "Pending"}</td>
                    <td>{stoneWeight || "-"}</td>
                    <td>{enamelWeight || "-"}</td>
                    <td>{beadsWeight || "-"}</td>
                    <td>{finalWeight.toFixed(2)}</td>
                    <td>{wastage.toFixed(2)}</td>
                    <td
                      style={{
                        color:
                          balance > 0 ? "green" : balance < 0 ? "red" : "blue",
                        fontWeight: "bold",
                      }}
                    >
                      {balance.toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewJobCard(jobCard)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedJobCard && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Job Card Details - #{selectedJobCard.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="job-card-detail">
              <div className="job-card-header">
                <div className="job-card-logo">JEEVA GOLD COINS</div>
                <div className="job-card-contact">
                  <p>Town Hall 458 Road</p>
                  <p>Coimbatore</p>
                  <p>9875637456</p>
                </div>
              </div>

              <div className="job-card-info">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedJobCard.date).toISOString().split("T")[0]}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedJobCard.description || "No description"}
                </p>
              </div>

              <div className="goldsmith-info">
                <h4>Goldsmith Information</h4>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedJobCard.goldsmith?.name || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedJobCard.goldsmith?.address || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedJobCard.goldsmith?.phone || "N/A"}
                </p>
              </div>

              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Given Weight</th>
                      <th>Touch</th>
                      <th>Purity Weight</th>
                      <th>Final Weight</th>
                      <th>Wastage</th>
                      <th>Stone</th>
                      <th>Enamel</th>
                      <th>Beads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedJobCard.items.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>{item.masterItem?.itemName || "N/A"}</td>
                        <td>{item.originalGivenWeight} g</td>
                        <td>{item.touch}</td>
                        <td>
                          {calculatePurityWeight(
                            item.originalGivenWeight,
                            item.touch
                          ).toFixed(2)}{" "}
                          g
                        </td>
                        <td>
                          {item.finalWeight
                            ? `${item.finalWeight} g`
                            : "Pending"}
                        </td>
                        <td>{item.wastage} g</td>
                        <td>
                          {item.additionalWeights?.find(
                            (aw) => aw.name === "stone"
                          )?.weight || "-"}{" "}
                          g
                        </td>
                        <td>
                          {item.additionalWeights?.find(
                            (aw) => aw.name === "enamel"
                          )?.weight || "-"}{" "}
                          g
                        </td>
                        <td>
                          {item.additionalWeights?.find(
                            (aw) => aw.name === "beeds"
                          )?.weight || "-"}{" "}
                          g
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default JobcardReport;










