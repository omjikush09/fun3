import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  unsupportedFeatures?: string[];
  cta: string;
  popular?: boolean;
  color?: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 12,
    priceYearly: 9, // Per month, billed yearly
    description: "Perfect for students, hobbyists, and individuals building side projects.",
    features: [
      "1 Active Project",
      "Live React Preview",
      "Up to 5 custom components",
      "Community support",
      "Basic export capabilities"
    ],
    unsupportedFeatures: [
      "Custom domain hosting",
      "Team collaboration",
      "Advanced AI prompt credits",
      "24/7 Priority support"
    ],
    cta: "Start Free Trial",
    color: "#fffdf6"
  },
  {
    id: "pro",
    name: "Pro Builder",
    priceMonthly: 29,
    priceYearly: 22,
    description: "For creators, freelancers, and small teams needing power and flexibility.",
    features: [
      "Unlimited Active Projects",
      "Instant Live React Preview",
      "Unlimited components",
      "Priority Email support (24h)",
      "Custom domains & SSL",
      "1,000 AI Prompt Credits / mo",
      "Advanced export with assets"
    ],
    unsupportedFeatures: [
      "Custom SLA & Dedicated host",
      "Team billing management"
    ],
    cta: "Upgrade to Pro",
    popular: true,
    color: "#cdff56"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 79,
    priceYearly: 59,
    description: "For agencies and scaling teams needing premium support and infinite scale.",
    features: [
      "Everything in Pro Builder",
      "Unlimited Team Members",
      "Dedicated account manager",
      "Custom SLA & 24/7/365 phone support",
      "Unlimited AI Prompt Credits",
      "Custom SSO / SAML integration",
      "On-premise deployment option"
    ],
    unsupportedFeatures: [],
    cta: "Contact Sales",
    color: "#e7f0ff"
  }
];

const FAQS = [
  {
    question: "How does the 14-day free trial work?",
    answer: "You can sign up for any plan without a credit card. You'll get full access to all features of that plan for 14 days. If you don't upgrade, you will simply be downgraded to our free read-only view."
  },
  {
    question: "Can I change plans or cancel at any time?",
    answer: "Absolutely! You can upgrade, downgrade, or cancel your subscription directly from your settings dashboard. If you downgrade or cancel, you'll still have access to paid features until the end of your billing cycle."
  },
  {
    question: "Do you offer discounts for educational institutions or non-profits?",
    answer: "Yes, we support students, teachers, and open-source creators with a 50% discount. Reach out to our support team with proof of your affiliation to claim your coupon code!"
  },
  {
    question: "What are 'AI Prompt Credits' and how do they renew?",
    answer: "AI Prompt Credits power the prompt-driven coding assistant. Each prompt edits, rewires, or styles your React elements. Credits reset on the 1st of every month and do not roll over."
  }
];

const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.78 }
];

export function App() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [currency, setCurrency] = useState("USD");
  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [comparisonVisible, setComparisonVisible] = useState(false);

  // Helper for currency conversion
  const currObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const cleaned = coupon.trim().toUpperCase();

    if (cleaned === "SAVE20") {
      setAppliedDiscount(20);
      setCouponSuccess("20% Coupon 'SAVE20' applied successfully!");
    } else if (cleaned === "SUPERSTUDENT") {
      setAppliedDiscount(50);
      setCouponSuccess("50% Student discount applied!");
    } else if (cleaned === "") {
      setCouponError("Please enter a coupon code.");
    } else {
      setCouponError("Invalid coupon code. Try 'SAVE20' or 'SUPERSTUDENT'!");
    }
  };

  const getPrice = (plan: Plan) => {
    const base = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
    const converted = base * currObj.rate;
    const discounted = converted * (1 - appliedDiscount / 100);
    return Math.round(discounted);
  };

  const selectPlanAction = (plan: Plan) => {
    setSelectedPlan(plan.name);
  };

  return (
    <main className="project-page">
      {/* Hero Section */}
      <section className="hero">
        <p className="kicker">Interactive Sandbox Workspace</p>
        <h1>Instant UI builder with Gemini Tool Integration</h1>
        <p className="lede">
          This project simulates a live interactive React application. Students use Gemini tool calls
          to modify elements, test features, and build fully functional modern interfaces.
        </p>
        <div className="feature-row">
          <span>⚡ Live React rendering</span>
          <span>💎 Responsive styling</span>
          <span>🛠️ Interactive states</span>
          <span>💅 Custom components</span>
        </div>
      </section>

      {/* Pricing Header Section */}
      <section className="pricing-section">
        <div className="pricing-header">
          <span className="badge">Transparent Pricing</span>
          <h2>Flexible plans for any scale</h2>
          <p className="subtitle">
            Get instant access to AI assistance, blazing-fast deployment, and professional components.
            Choose a plan that fits your ambition.
          </p>

          {/* Interactive Controls Bar */}
          <div className="controls-bar">
            {/* Billing Cycle Switcher */}
            <div className="toggle-container">
              <span className="toggle-label">Billing Cycle</span>
              <div className="toggle-buttons">
                <button
                  className={billingCycle === "monthly" ? "active" : ""}
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={billingCycle === "yearly" ? "active" : ""}
                  onClick={() => setBillingCycle("yearly")}
                >
                  Yearly <span className="save-tag">Save ~25%</span>
                </button>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="currency-container">
              <span className="toggle-label">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="neo-select"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Coupon Code Input */}
            <div className="coupon-container">
              <span className="toggle-label">Promo Code</span>
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <input
                  type="text"
                  placeholder="Promo code (e.g. SAVE20)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="neo-input"
                />
                <button type="submit" className="neo-btn-sm">
                  Apply
                </button>
              </form>
              <span className="coupon-hint">Try "SAVE20" or "SUPERSTUDENT"</span>
            </div>
          </div>

          {/* Coupon Status Message */}
          {couponError && <p className="coupon-msg error">{couponError}</p>}
          {couponSuccess && <p className="coupon-msg success">{couponSuccess}</p>}
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const price = getPrice(plan);
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`plan-card ${isPopular ? "popular-card" : ""}`}
                style={{ backgroundColor: plan.color }}
              >
                {isPopular && <div className="popular-ribbon">🔥 MOST POPULAR</div>}

                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.description}</p>
                </div>

                <div className="price-container">
                  <span className="price-symbol">{currObj.symbol}</span>
                  <span className="price-amount">{price}</span>
                  <span className="price-period">/ month</span>
                </div>

                <p className="billing-hint">
                  {billingCycle === "yearly"
                    ? `Billed annually (${currObj.symbol}${price * 12}/yr)`
                    : "Billed monthly"}
                </p>

                <button
                  className={`cta-button ${isPopular ? "cta-popular" : "cta-standard"}`}
                  onClick={() => selectPlanAction(plan)}
                >
                  {plan.cta}
                </button>

                <div className="divider" />

                <div className="features-list">
                  <p className="features-title">What's included:</p>
                  <ul>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="included-feature">
                        <svg
                          className="feat-icon success-icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feat}
                      </li>
                    ))}
                    {plan.unsupportedFeatures?.map((feat, idx) => (
                      <li key={idx} className="unsupported-feature">
                        <svg
                          className="feat-icon fail-icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Selection Notification / Success Modal */}
        {selectedPlan && (
          <div className="success-banner-overlay">
            <div className="success-banner">
              <h3>🎉 Perfect Choice!</h3>
              <p>
                You have selected the <strong>{selectedPlan}</strong> plan on the{" "}
                <strong>{billingCycle} billing cycle</strong> ({currObj.symbol}
                {getPrice(PLANS.find((p) => p.name === selectedPlan)!)}/mo, billed {billingCycle === "yearly" ? "annually" : "monthly"}).
              </p>
              {appliedDiscount > 0 && (
                <p className="discount-applied-alert">
                  🏷️ Applied {appliedDiscount}% coupon discount on your selection!
                </p>
              )}
              <div className="banner-actions">
                <button
                  className="neo-btn-sm success-btn"
                  onClick={() => alert(`Starting setup for your new ${selectedPlan} space...`)}
                >
                  Proceed to Checkout
                </button>
                <button
                  className="neo-btn-sm cancel-btn"
                  onClick={() => setSelectedPlan(null)}
                >
                  Change selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Toggle Button */}
        <div className="toggle-comparison-container">
          <button
            className="toggle-comparison-btn"
            onClick={() => setComparisonVisible(!comparisonVisible)}
          >
            {comparisonVisible ? "▲ Hide Full Plan Comparison" : "▼ Show Full Plan Comparison"}
          </button>
        </div>

        {/* Full Comparison Table */}
        {comparisonVisible && (
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature Details</th>
                  <th>Starter</th>
                  <th className="highlight-col">Pro Builder</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="feat-name">Monthly AI Credits</td>
                  <td>50 credits</td>
                  <td className="highlight-col">1,000 credits</td>
                  <td>Unlimited credits</td>
                </tr>
                <tr>
                  <td className="feat-name">Max Active Projects</td>
                  <td>1 Project</td>
                  <td className="highlight-col">Unlimited Projects</td>
                  <td>Unlimited Projects</td>
                </tr>
                <tr>
                  <td className="feat-name">Custom SSL Domains</td>
                  <td>❌ Not available</td>
                  <td className="highlight-col">✅ Up to 5 domains</td>
                  <td>✅ Unlimited domains</td>
                </tr>
                <tr>
                  <td className="feat-name">Deployment Targets</td>
                  <td>Static Host</td>
                  <td className="highlight-col">Static & Serverless</td>
                  <td>Any custom cloud / On-Premise</td>
                </tr>
                <tr>
                  <td className="feat-name">Team Collaboration</td>
                  <td>❌ Read-only share</td>
                  <td className="highlight-col">✅ Multi-user edit</td>
                  <td>✅ Full SSO / Role Permissions</td>
                </tr>
                <tr>
                  <td className="feat-name">Customer Support</td>
                  <td>Community Forum</td>
                  <td className="highlight-col">24h Priority Email</td>
                  <td>24/7/365 Dedicated Phone/SLA</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* FAQs Accordion */}
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <p className="faq-intro">Got questions about pricing, setup, or features? We're here to help.</p>
          <div className="faq-list">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`faq-item ${isOpen ? "open" : ""}`}
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                >
                  <div className="faq-question">
                    <span>{faq.question}</span>
                    <span className="faq-arrow">{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {isOpen && <p className="faq-answer">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pricing-footer">
        <p>
          Need custom volume billing? <a href="#contact">Contact our custom solutions team</a>. All rates
          exclude local taxes where applicable.
        </p>
      </footer>
    </main>
  );
}
