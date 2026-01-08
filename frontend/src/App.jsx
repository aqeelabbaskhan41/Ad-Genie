import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChatbotPage from "./pages/ChatbotPage";
import ImageEditingPage from "./pages/ImageEditingPage";
import PricingPage from "./pages/PricingPage";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import BlogsPage from "./pages/BlogsPage";
import ProfilePage from "./pages/ProfilePage";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="container mx-auto px-4 py-6">
                  <Header />
                </div>
                <div className="pt-24">
                  <HomePage />
                </div>
              </>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route 
            path="/chat" 
            element={
              <>
                <div className="container mx-auto px-4 py-6">
                  <Header />
                </div>
                <div className="pt-24">
                  <ChatbotPage />
                </div>
              </>
            } 
          />
          <Route path="/pricing" element={
              <>
                <div className="container mx-auto px-4 py-6">
                  <Header />
                </div>
                <div className="pt-24">
                  <PricingPage />
                </div>
              </>
            } 
          />
          <Route path="/contact" element={
              <>
                <div className="container mx-auto px-4 py-6">
                  <Header />
                </div>
                <div className="pt-24">
                  <ContactPage />
                </div>
              </>
            } 
          />
          <Route path="/blog" element={
              <>
                <div className="container mx-auto px-4 py-6">
                  <Header />
                </div>
                <div className="pt-24">
                  <BlogsPage />
                </div>
              </>
            } 
          />
          <Route path="/profile" element={
              <>
                <div className="container mx-auto px-4 py-6">
                  <Header />
                </div>
                <div className="pt-24">
                  <ProfilePage />
                </div>
              </>
            } 
          />
          <Route path="/editor" element={<ImageEditingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;