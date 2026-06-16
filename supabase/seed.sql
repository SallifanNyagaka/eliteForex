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
    "footerBlurb": "Professional Forex Account Management for serious investors.",
    "disclaimer": "Forex trading involves significant risk and may not be suitable for all investors. Past performance is not indicative of future results."
  }'::jsonb),
  ('navigation', '[
    { "label": "Home", "href": "#home" },
    { "label": "About", "href": "#why-us" },
    { "label": "Performance", "href": "#performance" },
    { "label": "Plans", "href": "#plans" },
    { "label": "FAQ", "href": "#faq" },
    { "label": "Contact", "href": "#apply" }
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
on conflict (section_key) do update
set payload = excluded.payload,
    updated_at = now();
