---
title: Welcome
description: Partner documentation for Centry integration
navigation: false
---

# Partner Documentation

::callout{icon="i-lucide-shield-check" color="green"}
This documentation is restricted to approved Centry partners.
::

Welcome to the Centry Partner Documentation. This section provides detailed technical information for integrating with the Centry fraud intelligence platform.

## Partner Responsibilities

As a Centry partner, you agree to:

1. **Protect API credentials** and rotate keys regularly
2. **Report suspicious activity** through designated channels
3. **Maintain compliance** with data protection regulations
4. **Use signals ethically** and within acceptable use guidelines
5. **Respond to incidents** within agreed SLA timeframes

## Legal & Compliance

By accessing this documentation, you acknowledge:

- You have signed the Centry Partner Agreement
- You understand the acceptable use policy
- You will not reverse engineer or exploit the platform
- You will protect the confidentiality of technical implementation details

## Documentation Sections

### Authentication
Learn how to authenticate API requests using API keys and manage credentials securely.

### Sandbox
Explore the sandbox environment with test data and mock responses.

### API Reference
Detailed endpoint documentation, payload schemas, and response formats.

### Operational Guides
Integration checklists, monitoring, and failure handling best practices.

### Limits & Quotas
Rate limits, fair use policies, and abuse detection constraints.

### Incidents
How to report suspicious activity and respond to security incidents.

## Support

For technical support, contact:
- **Email**: [support@centry.ai](mailto:support@centry.ai)
- **Slack**: Join your dedicated partner channel
- **Emergency**: Use the incident escalation path

## Rate Limits

Partner API access is subject to rate limiting based on your subscription tier:

| Tier | Requests/Minute | Requests/Day | Burst Limit |
|------|----------------|--------------|-------------|
| Sandbox | 100 | 10,000 | 150 |
| Starter | 1,000 | 100,000 | 1,500 |
| Professional | 5,000 | 500,000 | 7,500 |
| Enterprise | Custom | Custom | Custom |

::callout{icon="i-lucide-alert-triangle" color="amber"}
Exceeding rate limits will result in `429 Too Many Requests` responses. Implement exponential backoff in your integration.
::
