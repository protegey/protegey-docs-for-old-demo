---
title: Bienvenue
description: Documentation partenaire pour l'intégration de Protegey
navigation:
  title: Partenaires
---

::callout{icon="i-lucide-shield-check" color="green"}
Cette documentation est réservée aux partenaires approuvés de Protegey.
::

Bienvenue dans la documentation partenaire de Protegey. Cette section fournit des informations techniques détaillées pour l'intégration à la plateforme d'intelligence contre la fraude Protegey.

## Responsabilités des Partenaires

En tant que partenaire Protegey, vous acceptez de :

1. **Protéger les identifiants API** et renouveler les clés régulièrement
2. **Signaler toute activité suspecte** via les canaux désignés
3. **Maintenir la conformité** avec les réglementations sur la protection des données
4. **Utiliser les signaux de manière éthique** et conformément aux directives d'utilisation acceptable
5. **Répondre aux incidents** dans les délais prévus par les accords de niveau de service (SLA)

## Aspect Juridique et Conformité

En accédant à cette documentation, vous reconnaissez que :

- Vous avez signé l'Accord Partenaire Protegey
- Vous comprenez la politique d'utilisation acceptable
- Vous ne pratiquerez pas d'ingénierie inverse et n'exploiterez pas la plateforme
- Vous protégerez la confidentialité des détails techniques de mise en œuvre

## Sections de la Documentation

### Authentification

Apprenez à authentifier les requêtes API à l'aide de clés API et à gérer vos identifiants en toute sécurité.

### Sandbox (Bac à sable)

Explorez l'environnement sandbox avec des données de test et des réponses fictives.

### Référence API

Documentation détaillée des points de terminaison, des schémas de données et des formats de réponse.

### Guides Opérationnels

Listes de contrôle d'intégration, surveillance et meilleures pratiques pour la gestion des erreurs.

### Limites et Quotas

Limites de débit, politiques d'utilisation équitable et contraintes de détection des abus.

### Incidents

Comment signaler une activité suspecte et répondre aux incidents de sécurité.

## Support

Pour le support technique, contactez :

- **E-mail** : [support@protegey.com](mailto:support@protegey.com)
- **Slack** : Rejoignez votre canal partenaire dédié
- **Urgence** : Utilisez le chemin d'escalade des incidents

## Limites de Débit

L'accès à l'API partenaire est soumis à des limites de débit basées sur votre niveau d'abonnement :

| Niveau       | Requêtes/Minute | Requêtes/Jour | Limite de Pointe (Burst) |
| ------------ | --------------- | ------------- | ------------------------ |
| Sandbox      | 100             | 10 000        | 150                      |
| Starter      | 1 000           | 100 000       | 1 500                    |
| Professional | 5 000           | 500 000       | 7 500                    |
| Enterprise   | Sur mesure      | Sur mesure    | Sur mesure               |

::callout{icon="i-lucide-alert-triangle" color="amber"}
Le dépassement des limites de débit entraînera des réponses `429 Too Many Requests`. Implémentez un mécanisme de temporisation exponentielle (exponential backoff) dans votre intégration.
::
