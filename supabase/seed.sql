insert into public.site_content (section_key, payload)
values
  ('site', '{
    "brandName": "Elite Forex Fund",
    "tagline": "Professional forex account management",
    "whatsappNumber": "254708218368",
    "whatsappDisplay": "+254 708 218 368",
    "phone": "+254 708 218 368",
    "email": "support@eliteforexfund.com",
    "location": "Nairobi, Kenya",
    "socialLinks": [],
    "footerBlurb": "Professional Forex Account Management for serious investors.",
    "disclaimer": "Forex trading involves significant risk and may not be suitable for all investors. Past performance is not indicative of future results."
  }'::jsonb),
  ('navigation', '[
    { "label": "Home", "href": "/" },
    { "label": "About", "href": "/about" },
    { "label": "Services", "href": "/services" },
    { "label": "Packages", "href": "/packages" },
    { "label": "Performance", "href": "/performance" },
    { "label": "FAQ", "href": "/faq" },
    { "label": "Contact", "href": "/contact" }
  ]'::jsonb),
  ('hero', '{
    "eyebrow": "Elite Forex Fund",
    "title": "Professional Forex\nAccount Management",
    "description": "Grow your capital through disciplined risk management, proven strategies, and transparent reporting.",
    "primaryCta": "Apply Now",
    "secondaryCta": "View Performance",
    "rating": "4.9/5 Excellent",
    "highlights": [
      { "title": "Disciplined", "text": "Risk management first", "iconKey": "shield-check" },
      { "title": "Consistent", "text": "Performance transparency", "iconKey": "line-chart" },
      { "title": "Secure", "text": "Funds safety matters", "iconKey": "target" }
    ]
  }'::jsonb),
  ('stats', '[
    { "value": "250+", "label": "Active Clients" },
    { "value": "$8M+", "label": "Capital Managed" },
    { "value": "3+ Years", "label": "Proven Track Record" },
    { "value": "95%", "label": "Client Satisfaction" },
    { "value": "100%", "label": "Funds Security" }
  ]'::jsonb),
  ('plans', '[
    { "name": "Starter Plan", "deposit": "$500", "features": ["80% Profit Share (Client)", "20% Profit Share (Fund)", "Standard Risk Management", "Weekly Performance Report"] },
    { "name": "Growth Plan", "deposit": "$2,000", "features": ["80% Profit Share (Client)", "20% Profit Share (Fund)", "Dedicated Account Manager", "Advanced Trading Strategies", "Weekly Performance Report"], "featured": true },
    { "name": "Elite Plan", "deposit": "$10,000", "features": ["80% Profit Share (Client)", "20% Profit Share (Fund)", "Priority Support", "Custom Risk Settings", "Advanced Strategies"] }
  ]'::jsonb),
  ('performance', '[
    { "return": "+12.45%", "month": "May 2024" },
    { "return": "+10.32%", "month": "Apr 2024" },
    { "return": "+8.67%", "month": "Mar 2024" },
    { "return": "+15.21%", "month": "Feb 2024" },
    { "return": "+9.18%", "month": "Jan 2024" }
  ]'::jsonb),
  ('whyChoose', '[
    { "title": "Proven Trading Strategies", "text": "Market-tested approaches with a clear emphasis on risk control.", "iconKey": "target" },
    { "title": "Risk Management First", "text": "Capital preservation is treated as a product requirement.", "iconKey": "shield-check" },
    { "title": "Transparent Results", "text": "Publish date-stamped updates and keep the numbers current.", "iconKey": "line-chart" },
    { "title": "Dedicated Support", "text": "Offer a direct line of communication for every active client.", "iconKey": "users" }
  ]'::jsonb),
  ('steps', '[
    { "number": "1", "title": "Apply", "text": "Fill out the application form and choose your plan." },
    { "number": "2", "title": "Fund Your Account", "text": "We share the required details to start the account setup." },
    { "number": "3", "title": "We Trade", "text": "Our team manages the account with defined controls." },
    { "number": "4", "title": "You Profit", "text": "Receive your share of profits on the agreed schedule." }
  ]'::jsonb)
,
  ('about_hero', '{
    "eyebrow": "About Us",
    "title": "A disciplined approach to forex account management.",
    "description": "We operate with a premium, institutional presentation and a strong emphasis on risk management.",
    "ctaPrimary": "Explore Services",
    "ctaSecondary": "View Packages",
    "media": {
      "label": "About page hero placeholder",
      "note": "Replace with a brand-approved trading floor or leadership image."
    }
  }'::jsonb),
  ('about_journey', '{
    "startYear": 2019,
    "milestones": [
      { "label": "Foundation", "title": "Built around capital preservation", "text": "The operating model began with a risk-first philosophy." },
      { "label": "Refinement", "title": "Structured client reporting", "text": "Reporting and communication became a central product feature." },
      { "label": "Scale", "title": "Multi-page institutional presence", "text": "The brand now supports a fully dynamic client journey." }
    ]
  }'::jsonb),
  ('about_team', '[
    { "name": "Chief Strategist", "role": "Trading oversight", "linkedinUrl": "https://www.linkedin.com", "imageLabel": "Profile placeholder" },
    { "name": "Risk Lead", "role": "Risk and controls", "linkedinUrl": "https://www.linkedin.com", "imageLabel": "Profile placeholder" },
    { "name": "Client Success Manager", "role": "Onboarding and support", "linkedinUrl": "https://www.linkedin.com", "imageLabel": "Profile placeholder" }
  ]'::jsonb),
  ('services_hero', '{
    "eyebrow": "Services",
    "title": "Flagship account management services.",
    "description": "Discover the service offerings that support the client journey from onboarding to reporting.",
    "ctaPrimary": "See Packages",
    "ctaSecondary": "Contact Us"
  }'::jsonb),
  ('services_list', '[
    { "title": "Managed Forex Accounts", "description": "End-to-end account oversight for clients seeking a structured FX mandate.", "iconName": "briefcase-business", "bullets": ["Clear mandate", "Transparent reporting", "Execution oversight"] },
    { "title": "Risk Management Advisory", "description": "Capital-preservation frameworks and portfolio guardrails for serious investors.", "iconName": "shield-check", "bullets": ["Drawdown controls", "Position sizing", "Account monitoring"] },
    { "title": "Performance Analytics", "description": "Monthly reporting dashboards that keep clients aligned with live activity.", "iconName": "line-chart", "bullets": ["Monthly summaries", "Account metrics", "Priority updates"] }
  ]'::jsonb),
  ('packages_hero', '{
    "eyebrow": "Packages",
    "title": "Transparent entry points across every tier.",
    "description": "Each tier card is fully dynamic and can launch a pre-filled inquiry modal.",
    "ctaPrimary": "Inquire Now",
    "ctaSecondary": "Ask a Question"
  }'::jsonb),
  ('packages_tiers', '[
    { "name": "Starter", "minimumDeposit": "$500", "targetMonthlyRoi": "8 - 12%", "profitSplit": "80 / 20", "riskProfile": "Conservative", "benefits": ["Small-account friendly", "Weekly updates", "Standard risk controls"] },
    { "name": "Growth", "minimumDeposit": "$2,000", "targetMonthlyRoi": "10 - 15%", "profitSplit": "80 / 20", "riskProfile": "Balanced", "featured": true, "benefits": ["Dedicated manager", "Advanced strategy mix", "Priority reporting"] },
    { "name": "Elite", "minimumDeposit": "$10,000", "targetMonthlyRoi": "12 - 18%", "profitSplit": "80 / 20", "riskProfile": "Institutional", "benefits": ["Custom settings", "Priority support", "Tailored execution"] }
  ]'::jsonb),
  ('contact_hero', '{
    "eyebrow": "Contact",
    "title": "Reach out and submit a secure inquiry.",
    "description": "All contact information and lead capture fields are database-driven for quick updates.",
    "ctaPrimary": "Submit Inquiry",
    "ctaSecondary": "View FAQ"
  }'::jsonb),
  ('contact_channels', '[
    { "label": "Office Address", "value": "Nairobi, Kenya", "iconName": "map-pin" },
    { "label": "Phone", "value": "+254 708 218 368", "iconName": "phone" },
    { "label": "Email", "value": "support@eliteforexfund.com", "iconName": "mail" }
  ]'::jsonb),
  ('contact_budgets', '[
    "$500 - $2,000",
    "$2,000 - $10,000",
    "$10,000+"
  ]'::jsonb),
  ('faq_hero', '{
    "eyebrow": "FAQ",
    "title": "Frequently asked questions.",
    "description": "Questions and answers are ordered by admin priority for a clean reading experience.",
    "ctaPrimary": "Contact Us",
    "ctaSecondary": "View Packages"
  }'::jsonb),
  ('faq_items', '[
    { "question": "How do I get started?", "answer": "Choose a package or submit a contact inquiry and the team will guide you through onboarding.", "priority": 1 },
    { "question": "Can I change my package later?", "answer": "Yes. Package changes can be reviewed once your objectives are updated.", "priority": 2 },
    { "question": "How are results reported?", "answer": "Performance summaries are communicated through the reporting process and admin dashboard.", "priority": 3 }
  ]'::jsonb),
  ('performance_gallery', '[]'::jsonb)
on conflict (section_key) do update
set payload = excluded.payload,
    updated_at = now();
