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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>}></Route>
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
        ></Route>
        <Route
          path="/jobcard"
          element={
            <PageWithNavbar>
              <Jobcard />
            </PageWithNavbar>
          }
        ></Route>
        <Route path="/master" element={<Master />}></Route>
        <Route path="/mastercustomer" element={<MasterCustomer />}></Route>
        <Route path="/addcustomer"element={<AddCustomer/>}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

function PageWithNavbar({ children }) {
  const location = useLocation();
  if (location.pathname === "/") {
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



