import express, { Request, Response } from "express";
import { registerHandlers, Handlers } from "./generated/handlers";
import { openAPIParser } from "oapi-express-gen/src/parser";

const app = express();

// Apply the OpenAPI parser middleware to all routes
app.use(openAPIParser('./euler-consent-api.yaml'));

// Middleware for JSON parsing
app.use(express.json());

// Implement all handlers for the Euler Consent API
const handlers: Handlers = {
  // User API Endpoints
  getUserConsents: (req, res) => {
    const { includeInactive, pageToken } = req.query;
    res.json({
      consents: [
        {
          id: "consent-1",
          domain: "example.com",
          agreement: {
            id: "agreement-1",
            name: "Privacy Policy",
            version: "1.0.0",
            source: "direct",
            createdAt: new Date(),
            content: "<p>Privacy policy content...</p>"
          },
          consentItems: [
            {
              id: "item-1",
              name: "Analytics",
              description: "Allow analytics tracking",
              category: "marketing",
              status: "granted",
              textReference: "Section 3.1"
            }
          ],
          status: "active",
          grantedAt: new Date()
        }
      ],
      nextPageToken: pageToken ? "next-page-token" : undefined
    });
  },

  getUserConsentsByDomain: (req, res) => {
    const { domain } = req.params;
    const { includeInactive } = req.query;
    
    res.json({
      consents: [
        {
          id: "consent-1",
          domain: domain,
          agreement: {
            id: "agreement-1",
            name: "Privacy Policy",
            version: "1.0.0",
            source: "direct",
            createdAt: new Date(),
            content: "<p>Privacy policy content...</p>"
          },
          consentItems: [
            {
              id: "item-1",
              name: "Analytics",
              description: "Allow analytics tracking",
              category: "marketing",
              status: "granted",
              textReference: "Section 3.1"
            }
          ],
          status: "active",
          grantedAt: new Date()
        }
      ],
      nextPageToken: undefined
    });
  },

  postUserConsentsRevoke: (req, res) => {
    const { domain, agreementId, agreementVersion, consentItemIds, reason } = req.body;
    
    res.json({
      receipt: "receipt-string-123",
      revokedItems: consentItemIds || ["item-1"],
      revokedAt: new Date()
    });
  },

  postUserConsentsGrant: (req, res) => {
    const { domain, agreementId, agreementVersion, consentItemIds } = req.body;
    
    res.json({
      receipt: "receipt-string-456",
      grantedItems: consentItemIds,
      grantedAt: new Date()
    });
  },

  getUserHistory: (req, res) => {
    const { domain, actionType, startDate, endDate, pageToken } = req.query;
    
    res.json({
      history: [
        {
          id: "history-1",
          domain: domain || "example.com",
          action: actionType || "grant",
          consentItems: ["item-1"],
          agreement: {
            id: "agreement-1",
            name: "Privacy Policy",
            version: "1.0.0",
            source: "direct",
            createdAt: new Date(),
            content: "<p>Privacy policy content...</p>"
          },
          timestamp: new Date()
        }
      ],
      nextPageToken: pageToken ? "next-page-token" : undefined
    });
  },

  postUserReceiptsVerify: (req, res) => {
    const { receipt } = req.body;
    
    res.json({
      isValid: true,
      signatureValid: true,
      timestamp: new Date(),
      verificationDetails: { verified: true },
      receiptData: {
        userId: "user-123",
        domain: "example.com",
        action: "grant",
        consentItems: ["item-1"],
        agreement: {
          id: "agreement-1",
          name: "Privacy Policy",
          version: "1.0.0",
          source: "direct",
          createdAt: new Date(),
          content: "<p>Privacy policy content...</p>"
        },
        timestamp: new Date()
      }
    });
  },

  getUserNotificationsPreferences: (req, res) => {
    res.json({
      emailEnabled: true,
      emailFrequency: "daily",
      smsEnabled: false,
      pushEnabled: true,
      notificationTypes: ["consentChanges", "agreementUpdates"]
    });
  },

  putUserNotificationsPreferences: (req, res) => {
    const { emailEnabled, emailFrequency, smsEnabled, pushEnabled, notificationTypes } = req.body;
    
    res.json({
      emailEnabled: emailEnabled || true,
      emailFrequency: emailFrequency || "daily",
      smsEnabled: smsEnabled || false,
      pushEnabled: pushEnabled || true,
      notificationTypes: notificationTypes || ["consentChanges"]
    });
  },

  getUserNotificationsLedger: (req, res) => {
    const { notificationType, startDate, endDate, pageToken } = req.query;
    
    res.json({
      notifications: [
        {
          id: "notification-1",
          type: notificationType || "email",
          subject: "Consent Update",
          content: "Your consent preferences have been updated",
          sentAt: new Date(),
          status: "delivered"
        }
      ],
      nextPageToken: pageToken ? "next-page-token" : undefined
    });
  },

  // Management API Endpoints
  getAdminAgreements: (req, res) => {
    const { status, domain, pageToken } = req.query;
    
    res.json({
      agreements: [
        {
          id: "agreement-1",
          name: "Privacy Policy",
          version: "1.0.0",
          status: status || "active",
          domain: domain || "example.com",
          content: "<p>Privacy policy content...</p>",
          consentItems: [
            {
              id: "item-1",
              name: "Analytics",
              description: "Allow analytics tracking",
              category: "marketing",
              required: true,
              defaultStatus: "granted",
              textReference: "Section 3.1"
            }
          ],
          acceptanceCount: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        }
      ],
      nextPageToken: pageToken ? "next-page-token" : undefined
    });
  },

  postAdminAgreements: (req, res) => {
    const { name, domain, content, consentItems } = req.body;
    
    res.status(201).json({
      id: "agreement-new",
      name: name,
      version: "1.0.0",
      status: "draft",
      domain: domain,
      content: content,
      consentItems: consentItems,
      acceptanceCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  getAdminAgreementsByAgreementId: (req, res) => {
    const { agreementId } = req.params;
    
    res.json({
      id: agreementId,
      name: "Privacy Policy",
      version: "1.0.0",
      status: "active",
      domain: "example.com",
      content: "<p>Privacy policy content...</p>",
      consentItems: [
        {
          id: "item-1",
          name: "Analytics",
          description: "Allow analytics tracking",
          category: "marketing",
          required: true,
          defaultStatus: "granted",
          textReference: "Section 3.1"
        }
      ],
      acceptanceCount: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date()
    });
  },

  putAdminAgreementsByAgreementId: (req, res) => {
    const { agreementId } = req.params;
    const { name, content, consentItems } = req.body;
    
    res.json({
      id: agreementId,
      name: name || "Updated Privacy Policy",
      version: "1.1.0",
      status: "draft",
      domain: "example.com",
      content: content || "<p>Updated privacy policy content...</p>",
      consentItems: consentItems || [],
      acceptanceCount: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  postAdminAgreementsByAgreementIdPublish: (req, res) => {
    const { agreementId } = req.params;
    
    res.json({
      id: agreementId,
      name: "Privacy Policy",
      version: "1.0.0",
      status: "active",
      domain: "example.com",
      content: "<p>Privacy policy content...</p>",
      consentItems: [],
      acceptanceCount: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date()
    });
  },

  getAdminDomains: (req, res) => {
    const { status } = req.query;
    
    res.json({
      domains: [
        {
          id: "domain-1",
          name: "Example Domain",
          fqdn: "example.com",
          status: status || "active",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      totalCount: 1
    });
  },

  postAdminDomains: (req, res) => {
    const { name, fqdn } = req.body;
    
    res.status(201).json({
      id: "domain-new",
      name: name,
      fqdn: fqdn,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  putAdminDomainsByDomainId: (req, res) => {
    const { domainId } = req.params;
    const { name, status } = req.body;
    
    res.json({
      id: domainId,
      name: name || "Updated Domain",
      fqdn: "example.com",
      status: status || "active",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  postAdminImportConsents: (req, res) => {
    const { domain, agreementId, overwriteExisting } = req.body;
    
    res.status(202).json({
      jobId: "import-job-123",
      status: "pending",
      totalRecords: 100,
      processedRecords: 0,
      createdAt: new Date()
    });
  },

  getAdminUsers: (req, res) => {
    const { email, domain, pageToken } = req.query;
    
    res.json({
      users: [
        {
          id: "user-1",
          email: email || "user@example.com",
          domains: [domain || "example.com"],
          consentCount: 5,
          lastUpdated: new Date()
        }
      ],
      nextPageToken: pageToken ? "next-page-token" : undefined
    });
  },

  getAdminUsersByUserId: (req, res) => {
    const { userId } = req.params;
    
    res.json({
      id: userId,
      email: "user@example.com",
      domains: ["example.com"],
      consents: [],
      consentHistory: []
    });
  },

  getAdminActivityLogs: (req, res) => {
    const { actionType, userId, startDate, endDate, pageToken } = req.query;
    
    res.json({
      logs: [
        {
          id: "log-1",
          userId: userId || "user-1",
          userEmail: "user@example.com",
          action: actionType || "create",
          details: "Created new agreement",
          timestamp: new Date(),
          resourceType: "agreement",
          resourceId: "agreement-1"
        }
      ],
      nextPageToken: pageToken ? "next-page-token" : undefined
    });
  },

  getAdminDashboard: (req, res) => {
    res.json({
      totalAgreements: 5,
      activeAgreements: 3,
      totalConsents: 150,
      recentActivityCount: 10,
      domains: [
        {
          domain: "example.com",
          consentCount: 100,
          userCount: 50,
          status: "active"
        }
      ]
    });
  },

  // Audit API Endpoints
  postAuditReceiptsVerify: (req, res) => {
    const { receipt } = req.body;
    
    res.json({
      isValid: true,
      signatureValid: true,
      timestamp: new Date(),
      verificationDetails: { verified: true },
      receiptData: {
        userId: "user-123",
        domain: "example.com",
        action: "grant",
        consentItems: ["item-1"],
        agreement: {
          id: "agreement-1",
          name: "Privacy Policy",
          version: "1.0.0",
          source: "direct",
          createdAt: new Date(),
          content: "<p>Privacy policy content...</p>"
        },
        timestamp: new Date()
      }
    });
  }
};

// Register all handlers with Express
registerHandlers(app, handlers);

// Start the server
const PORT = 3001; // Use different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`🚀 Euler Consent API server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
});

export default app; 