# Protegey Documentation

> Official documentation for the Protegey fraud intelligence platform

This is the documentation site for Protegey, built with Nuxt + Docus. It implements a three-tiered access control model to serve different audiences with appropriate levels of information.

**Status**: Live with full API coverage (English, French, Arabic).

---

## Documentation Tiers

### Public Documentation (`/`)

Open to everyone - prospects, regulators, evaluators, and engineers scouting the platform.

**Sections:**

- Overview - What is Protegey, who it's for, what it's not
- Platform - High-level architecture and network effects
- Security - Security principles and data handling
- Compliance - AML/KYC positioning
- API - Overview with rate limiting philosophy
- Getting Started - Partner onboarding flow
- Resources - Glossary, FAQs, status page

### Partner Documentation (`/partners`)

Restricted to approved partners with authentication required.

**Sections:**

- Authentication - API key management and security
- Environments - Production and sandbox configuration
- API Reference - Detailed endpoint documentation for all partner endpoints
  - Signals (ingestion, UFES schema)
  - Cases (10 endpoints)
  - Alerts (5 endpoints + lineage)
  - Entities (5 endpoints)
  - Team (5 endpoints)
  - Audit logs
  - Webhooks
  - Intelligence sharing
  - Advisories
  - Compliance (RCaaS)
- Operational Guides - Integration checklists, go-live requirements
- Limits & Quotas - Rate limiting and fair use
- Sandbox - Test environment and demo signal generation

### Internal Documentation (`/internal`)

Restricted to Protegey team members only.

**Sections:**

- Architecture - System diagrams, trust weighting
- Detection - Scoring mechanics, taxonomy registry, audit lineage
- Operations - Incident playbooks
- Partners - Partner risk profiles
- Security - Vulnerability management

---

## Quick Start

```bash
# From monorepo root
pnpm --filter @centry/docs dev

# Or from this directory
pnpm dev
```

Your documentation site will be running at `http://localhost:3000`

---

## Authentication

The documentation site uses role-based access control:

- **Public routes** (`/`) - No authentication required
- **Partner routes** (`/partners/**`) - Requires partner authentication
- **Internal routes** (`/internal/**`) - Requires internal team authentication

Authentication is handled via JWT tokens stored in cookies, with middleware protecting restricted routes.

---

## Project Structure

```
apps/docs/
├── content/              # Markdown content organized by tier
│   ├── en/               # English content
│   ├── fr/               # French content
│   ├── ar/               # Arabic content
│   └── index.md          # Language selector
├── middleware/           # Route protection middleware
├── composables/          # Vue composables
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── app.config.ts         # Docus configuration
├── nuxt.config.ts        # Nuxt configuration
└── package.json          # Dependencies and scripts
```

---

## Rate Limiting Documentation

Comprehensive rate limiting documentation is included:

- **Public API Overview**: High-level rate limit philosophy
- **Partner Limits & Quotas**: Detailed tier-based limits, headers, error handling, and best practices

Rate limit tiers:

| Tier         | Requests/Minute | Requests/Day |
| ------------ | --------------- | ------------ |
| Sandbox      | 100             | 10,000       |
| Starter      | 1,000           | 100,000      |
| Professional | 5,000           | 500,000      |
| Enterprise   | Custom          | Custom       |

---

## Built With

- [Nuxt 4](https://nuxt.com) - The Vue framework
- [Docus](https://docus.dev) - Documentation theme
- [Nuxt Content](https://content.nuxt.com/) - File-based CMS
- [Nuxt UI](https://ui.nuxt.com) - UI components
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS

---

## Deployment

Build for production:

```bash
pnpm build
```

The built files will be in the `.output` directory, ready for deployment.

---

## Security Principles

Documentation is treated as **product infrastructure** and a **security surface**:

- **Intentional**: Every piece of information is deliberately placed
- **Progressive**: Information unlocks as trust increases through onboarding
- **Enforced**: Middleware prevents unauthorized access
- **Monitored**: Rate limits prevent abuse

---

## Documentation Philosophy

### Public Documentation

- Establish credibility and explain value
- No implementation details that enable reverse engineering
- No payload schemas, thresholds, or scoring logic

### Partner Documentation

- Enable precise and safe integrations
- Protect Protegey's intelligence surface
- Include operational guidance and best practices

### Internal Documentation

- Preserve system integrity
- Maintain operational consistency
- Document institutional knowledge

---

## Contributing

For Protegey team members:

1. Content is organized by access tier - ensure new content goes in the correct directory
2. Use Docus components for callouts, alerts, and formatting
3. Test authentication flows when adding protected content
4. Update navigation in `app.config.ts` if adding new sections

---

## What's Next

**Phase 11: KYC/KYB Verification** - Documentation for:

- KYC identity profile endpoints
- Document upload and verification
- KYB beneficial ownership

**Phase 12: Cold Graph (P2)** - Documentation for:

- Fraud ring visualization API
- Community detection endpoints

---

## License

Proprietary - Protegey © 2026
