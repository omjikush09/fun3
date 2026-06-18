import React, { useState } from "react";

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  popular?: boolean;
  color?: string;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Perfect for students & hobbyists exploring interactive coding.",
    features: [
      "3 active sandbox projects",
      "Live React preview in browser",
      "Standard prompt generation limit",
      "Community support discord",
      "Basic file exports"
    ],
    color: "#ffffff"
  },
  {
    id: "pro",
    name: "Developer Pro",
    priceMonthly: 19,
    priceYearly: 15,
    description: "Unleash maximum productivity with extended Gemini features.",
    features: [
      "Unlimited active sandboxes",
      "Priority preview server (Instant load)",
      "Uncapped prompt edits & API custom calls",
      "Advanced file tree & structural tools",
      "Discord Premium access & Dev support",
      "Offline cache support"
    ],
    popular: true,
    badge: "Most Popular",
    color: "#cdff56"
  },
  {
    id: "enterprise",
    name: "Enterprise Team",
    priceMonthly: 49,
    priceYearly: 39,
    description: "Custom capabilities and collaborative workspaces for teams.",
    features: [
      "Everything in Developer Pro",
      "Dedicated runner environments",
      "SSO/SAML & Advanced access control",
      "Custom system prompts & model selection",
      "24/7 dedicated account manager",
      "Shared team workspaces & analytics"
    ],
    color: "#e7f0ff"
  }
];

export function App() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [purchaseStep, setPurchaseStep] = useState<"idle" | "success">("idle");

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£"
  };

  const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79
  };

  const convertPrice = (priceUSD: number) => {
    return Math.round(priceUSD * currencyRates[currency]);
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setPurchaseStep("idle");
    setEmailInput("");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setPurchaseStep("success");
  };

  return (
    <main className="project-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <p className="kicker">Flexible Pricing Plans</p>
          <h1>Find the perfect plan for your development.</h1>
          <p className="lede">
            Scale your React workspace dynamically. Start for free, upgrade as you build larger templates, or scale to enterprise levels with custom tools.
          </p>

          {/* Pricing Controls Row */}
          <div className="pricing-controls">
            <div className="toggle-container">
              <span className={`toggle-label ${billingCycle === "monthly" ? "active" : ""}`}>
                Monthly
              </span>
              <button
                className={`switch-button ${billingCycle === "yearly" ? "checked" : ""}`}
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                aria-label="Toggle billing cycle"
              >
                <span className="switch-handle" />
              </button>
              <span className={`toggle-label ${billingCycle === "yearly" ? "active" : ""}`}>
                Yearly <span className="save-badge">Save ~20%</span>
              </span>
            </div>

            <div className="currency-selector">
              <label htmlFor="currency-select" className="currency-label">Currency:</label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="currency-dropdown"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {plans.map((plan) => {
            const rawPrice = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
            const finalPrice = convertPrice(rawPrice);

            return (
              <div
                key={plan.id}
                className={`pricing-card ${plan.popular ? "featured" : ""}`}
                style={{ "--accent-color": plan.color } as React.CSSProperties}
              >
                {plan.popular && <div className="popular-badge">{plan.badge}</div>}
                
                <div className="card-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.description}</p>
                </div>

                <div className="price-container">
                  <span className="price-currency">{currencySymbols[currency]}</span>
                  <span className="price-amount">{finalPrice}</span>
                  <span className="price-period">
                    /{billingCycle === "monthly" ? "mo" : "mo"}
                  </span>
                </div>
                
                {billingCycle === "yearly" && plan.priceYearly > 0 && (
                  <div className="billed-annually">
                    Billed annually ({currencySymbols[currency]}
                    {convertPrice(plan.priceYearly * 12)}/yr)
                  </div>
                )}
                {plan.priceMonthly === 0 && <div className="billed-annually">Free forever</div>}

                <button
                  className="plan-cta-button"
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.priceMonthly === 0 ? "Get Started" : `Subscribe to ${plan.name}`}
                </button>

                <div className="divider" />

                <div className="features-section">
                  <p className="features-title">What's included:</p>
                  <ul className="features-list">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="feature-item">
                        <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Plan Checkout / Selection Modal Helper */}
        {selectedPlan && (
          <div className="modal-overlay" onClick={() => setSelectedPlan(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedPlan(null)} aria-label="Close modal">
                &times;
              </button>
              
              {purchaseStep === "idle" ? (
                <div>
                  <div className="modal-header-accent" style={{ background: selectedPlan.color }} />
                  <span className="modal-kicker">Checkout Simulation</span>
                  <h2>Subscribe to {selectedPlan.name}</h2>
                  <p className="modal-desc">
                    You've selected the <strong>{selectedPlan.name}</strong> plan billed{" "}
                    <strong>{billingCycle}</strong> at{" "}
                    <strong>
                      {currencySymbols[currency]}
                      {convertPrice(billingCycle === "monthly" ? selectedPlan.priceMonthly : selectedPlan.priceYearly)}/{billingCycle === "monthly" ? "month" : "month"}
                    </strong>.
                  </p>

                  <form onSubmit={handleSubscribe} className="checkout-form">
                    <label htmlFor="email" className="form-label">Enter your email address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="hello@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="checkout-input"
                    />
                    <button type="submit" className="checkout-submit-btn">
                      Confirm & Start Sandbox
                    </button>
                  </form>
                  <p className="modal-disclaimer">
                    No actual payment information is required. This is a fully functional prototype playground.
                  </p>
                </div>
              ) : (
                <div className="success-screen">
                  <div className="success-icon">🎉</div>
                  <h2>Welcome onboard!</h2>
                  <p>
                    Thank you for choosing <strong>{selectedPlan.name}</strong>. A simulated confirmation email has been sent to <strong>{emailInput}</strong>.
                  </p>
                  <div className="receipt-box">
                    <p><strong>Plan:</strong> {selectedPlan.name} ({billingCycle})</p>
                    <p><strong>Price:</strong> {currencySymbols[currency]}{convertPrice(billingCycle === "monthly" ? selectedPlan.priceMonthly : selectedPlan.priceYearly)}/{billingCycle === "monthly" ? "mo" : "mo"}</p>
                    <p><strong>Status:</strong> Active (Prototype Mode)</p>
                  </div>
                  <button className="checkout-submit-btn" onClick={() => setSelectedPlan(null)}>
                    Back to Pricing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compare Table Toggle or Interactive Features Area */}
        <section className="faq-section">
          <h2>Pricing Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-card">
              <h4>Can I upgrade or downgrade anytime?</h4>
              <p>Yes, absolutely! You can upgrade, downgrade, or cancel your plan at any moment from your simulated dashboard billing settings. Changes are immediate.</p>
            </div>
            <div className="faq-card">
              <h4>Are there any hidden fees or API limits?</h4>
              <p>None. The prices listed represent everything you pay. Standard plans have high fair-use limits, while Developer Pro and Enterprise offer unlimited requests.</p>
            </div>
            <div className="faq-card">
              <h4>What models power the React preview engine?</h4>
              <p>Our editing assistant runs on Gemini 1.5 Pro and Flash, enabling instant structural edits to HTML, CSS, and TSX files with outstanding speed.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
