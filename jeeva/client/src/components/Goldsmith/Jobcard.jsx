import React from "react";
import "./Jobcard.css";

const Jobcard = () => {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-card-logo">
         
         
          JEEVA GOLD COINS
        </div>
        <div className="job-card-contact">
          <p>9875637456</p>
          <p>Town Hall 458 Road</p>
          <p>Coimbatore</p>
        </div>
      </div>

      <div className="job-card-details">
        <div className="job-card-number">
          <p>
            <strong>No.:</strong> JC20-001
          </p>
          <p>
            <strong>Date:</strong> March 8, 2025
          </p>
        </div>

        <div className="job-card-customer">
          <h3>Customer Information</h3>
          <p>
            <strong>Name:</strong> Joseph
          </p>
          <p>
            <strong>Address:</strong> 123 Main Street,
          </p>
          <p>
            <strong>Phone:</strong> 9867453678
          </p>
          
        </div>

        <div className="job-card-description">
          <h3>Description</h3>
          <p>Design with modern and minimalist design</p>
        </div>

        <div className="job-card-designer">
          <p>
            <strong>Goldsmith:</strong> John Smith
          </p>
        </div>
<br></br>
        
        <div className="job-card-items">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Item Description</th>
                <th>Pieces</th>
                <th>Price</th>
                <th>Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Chain</td>
                <td>1</td>
                <td>50.00</td>
                <td>50.00</td>
              </tr>
             
            </tbody>
          </table>
        </div>

        <div className="job-card-total">
          <p>
            <strong>Subtotal:</strong> 150.00
          </p>
          <p>
            <strong>Taxes:</strong> 12.00 (Assuming 8% sales tax)
          </p>
          <p>
            <strong>Total Amount:</strong> 162.00
          </p>
        </div>

        <div className="job-card-signature">
          <p>
            <strong>Authorized Signature:</strong> _________________________
          </p>
        </div>
      </div>

      <div className="job-card-footer">
        <p>jeevagoldcoins@gmail.com </p>
      </div>
    </div>
  );
};

export default Jobcard;
