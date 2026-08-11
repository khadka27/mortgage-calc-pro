# MortgagePro Global

A mathematically precise, multi-currency global mortgage calculator supporting 22+ countries, live interest rates, accelerated payoff simulations, home affordability, refinancing, and client-side PDF exports.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy [.env.example](file://./.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

---

## Nginx Setup (Port Forwarding & Reverse Proxy)

A pre-configured Nginx file is included: [`nginx.conf`](file://./nginx.conf).

### 1. Copy config to Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/mortgage-calc.conf
```

### 2. Enable site & test configuration
```bash
sudo ln -s /etc/nginx/sites-available/mortgage-calc.conf /etc/nginx/sites-enabled/
sudo nginx -t
```

### 3. Reload Nginx
```bash
sudo systemctl reload nginx
```

Now requests to port `80` (or your domain/IP) will forward automatically to your Next.js app running on `http://127.0.0.1:3000`.
