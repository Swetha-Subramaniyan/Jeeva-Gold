
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Customer from "./components/Customer/Customer";
import Goldsmith from "./components/Goldsmith/Goldsmith";
import Billing from "./components/Billing/Billing";
import Report from "./components/Report/Report";
import Stock from "./components/Stock/Stock";
import Navbar from "./components/Navbar/Navbar";
import Master from "./components/Master/Master";
import MasterCustomer from "./components/Master/Mastercustomer";
import Customertrans from "./components/Customer/Customertrans";
import Jobcard from "./components/Goldsmith/Jobcard";
import AddCustomer from "./components/Billing/Addcustomer";
import Register from "./components/Home/Register";
import Billingjewel from "./components/Billing/Billingjewel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/customer"
          element={
            <PageWithNavbar>
              <Customer />
            </PageWithNavbar>
          }
        />
        <Route
          path="/goldsmith"
          element={
            <PageWithNavbar>
              <Goldsmith />
            </PageWithNavbar>
          }
        />
        <Route
          path="/billing"
          element={
            <PageWithNavbar>
              <Billing />
            </PageWithNavbar>
          }
        />
        <Route
          path="/report"
          element={
            <PageWithNavbar>
              <Report />
            </PageWithNavbar>
          }
        />
        <Route
          path="/stock"
          element={
            <PageWithNavbar>
              <Stock />
            </PageWithNavbar>
          }
        />
        <Route
          path="/customertrans"
          element={
            <PageWithNavbar>
              <Customertrans />
            </PageWithNavbar>
          }
        />
        <Route
          path="/jobcard/:id/:name"
          element={
            <PageWithNavbar>
              <Jobcard />
            </PageWithNavbar>
          }
        />
        <Route path="/master" element={<Master />} />
        <Route path="/mastercustomer" element={<MasterCustomer />} />
        <Route path="/addcustomer" element={<AddCustomer />} />
        <Route
          path="/billingjewel"
          element={
            <PageWithNavbar>
              <Billingjewel />
            </PageWithNavbar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function PageWithNavbar({ children }) {
  const location = useLocation();
  // Hide navbar for these paths
  const hideNavbarPaths = ["/", "/register"];

  if (hideNavbarPaths.includes(location.pathname)) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default App;