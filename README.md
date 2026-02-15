# Protegey Documentation

> Official documentation for the Protegey fraud intelligence platform

This is the documentation site for Protegey, built with Nuxt + Docus. It implements a three-tiered access control model to serve different audiences with appropriate levels of information.

**Status**: Documentation structure and rate limiting docs complete. API reference for 30+ partner endpoints is a Phase 6 priority.

**Coverage gap**: 30+ partner API endpoints (cases, alerts, entities, team, audit logs, signal ingestion) are undocumented. See the master plan for Phase 6 documentation sprint.

## 🎯 Documentation Tiers

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
- Sandbox - Test environment and mock data generation (demo signals, reset)
- API Reference - Detailed endpoint documentation *(coverage gap — Phase 6)*
- Operational Guides - Integration checklists
- Limits & Quotas - Rate limiting and fair use (Sandbox: 30/min, Production: configurable)
- Incidents - Suspicious activity reporting

**API endpoints to document (Phase 6)**:
- Signal ingestion (UFES schema + validation errors)
- Case management (10 endpoints)
- Alert management + lineage (5 endpoints)
- Entity intelligence (5 endpoints)
- Team management (5 endpoints)
- Audit logs, dashboard, transaction monitoring

### Internal Documentation (`/internal`)
Restricted to Protegey team members only.

**Sections:**
- Architecture - Real system diagrams and trust weighting
- Detection - Scoring mechanics and tuning
- Operations - Incident playbooks and emergency controls
- Partners - Partner risk profiles and overrides
- Security - Penetration tests and vulnerability management

## 🚀 Quick Start

```bash
# From monorepo root
pnpm --filter @centry/docs dev

# Or from this directory
pnpm dev
```

Your documentation site will be running at `http://localhost:3000`

## 🔐 Authentication

The documentation site uses role-based access control:

- **Public routes** (`/`) - No authentication required
- **Partner routes** (`/partners/**`) - Requires partner authentication
- **Internal routes** (`/internal/**`) - Requires internal team authentication

Authentication is handled via JWT tokens stored in cookies, with middleware protecting restricted routes.

## 📁 Project Structure

```
apps/docs/
├── content/              # Markdown content organized by tier
│   ├── index.md         # Public homepage
│   ├── 1.overview/      # Public overview section
│   ├── 5.api/           # Public API overview
│   ├── 6.getting-started/ # Onboarding information
│   ├── partners/        # Partner-only documentation
│   └── internal/        # Internal team documentation
├── middleware/          # Route protection middleware
│   ├── partner-auth.ts  # Partner route protection
│   └── internal-auth.ts # Internal route protection
├── composables/         # Vue composables
│   └── useAuth.ts       # Authentication state management
├── types/               # TypeScript type definitions
│   └── auth.ts          # Auth-related types
├── public/              # Static assets
├── app.config.ts        # Docus configuration
├── nuxt.config.ts       # Nuxt configuration
└── package.json         # Dependencies and scripts
```

## 📊 Rate Limiting Documentation

Comprehensive rate limiting documentation is included:

- **Public API Overview**: High-level rate limit philosophy
- **Partner Limits & Quotas**: Detailed tier-based limits, headers, error handling, and best practices

Rate limit tiers:

| Tier | Requests/Minute | Requests/Day |
|------|----------------|--------------|
| Sandbox | 100 | 10,000 |
| Starter | 1,000 | 100,000 |
| Professional | 5,000 | 500,000 |
| Enterprise | Custom | Custom |

## ⚡ Built With

- [Nuxt 4](https://nuxt.com) - The Vue framework
- [Docus](https://docus.dev) - Documentation theme
- [Nuxt Content](https://content.nuxt.com/) - File-based CMS
- [Nuxt UI](https://ui.nuxt.com) - UI components
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS

## 🚀 Deployment

Build for production:

```bash
pnpm build
```

The built files will be in the `.output` directory, ready for deployment.

## 🔒 Security Principles

Documentation is treated as **product infrastructure** and a **security surface**:

- **Intentional**: Every piece of information is deliberately placed
- **Progressive**: Information unlocks as trust increases through onboarding
- **Enforced**: Middleware prevents unauthorized access
- **Monitored**: Rate limits prevent abuse

## 📖 Documentation Philosophy

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

## 🤝 Contributing

For Protegey team members:

1. Content is organized by access tier - ensure new content goes in the correct directory
2. Use Docus components for callouts, alerts, and formatting
3. Test authentication flows when adding protected content
4. Update navigation in `app.config.ts` if adding new sections

## 🗺️ What's Next

**Phase 6: Documentation Refresh** (planned after Phase 4 Collaborative Intelligence)
- Document all 30+ partner API endpoints with request/response schemas
- Add sandbox quick-start guide with demo signal walkthrough
- Add UFES signal schema reference
- Add alert lineage explainability guide
- Architecture diagrams: pipeline (Resolver → Feature → Detector → Taxonomy → Alert)

## 📄 License

Proprietary - Protegey © 2026