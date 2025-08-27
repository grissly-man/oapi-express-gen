import { Handlers } from './generated/handlers';

// Test that all handlers are properly typed
const testHandlers: Handlers = {
  // User API Endpoints
  getUserConsents: (req, res) => {
    // Test query parameter types
    const { includeInactive, pageToken } = req.query;
    
    // Test that includeInactive is properly typed as boolean
    if (includeInactive === true) {
      console.log('Include inactive consents');
    }
    
    // Test that pageToken is properly typed as string
    if (pageToken && typeof pageToken === 'string') {
      console.log('Page token:', pageToken);
    }
    
    res.json({ consents: [], nextPageToken: undefined });
  },

  getUserConsentsByDomain: (req, res) => {
    // Test path parameter types
    const { domain } = req.params;
    
    // Test that domain is properly typed as string
    if (typeof domain === 'string') {
      console.log('Domain:', domain);
    }
    
    // Test query parameter types
    const { includeInactive } = req.query;
    
    res.json({ consents: [], nextPageToken: undefined });
  },

  postUserConsentsRevoke: (req, res) => {
    // Test request body types
    const { domain, agreementId, agreementVersion, consentItemIds, reason } = req.body;
    
    // Test required fields
    if (typeof domain !== 'string') {
      throw new Error('Domain must be string');
    }
    
    if (typeof agreementId !== 'string') {
      throw new Error('Agreement ID must be string');
    }
    
    if (typeof agreementVersion !== 'string') {
      throw new Error('Agreement version must be string');
    }
    
    // Test optional fields
    if (consentItemIds && Array.isArray(consentItemIds)) {
      consentItemIds.forEach(id => {
        if (typeof id !== 'string') {
          throw new Error('Consent item ID must be string');
        }
      });
    }
    
    if (reason && typeof reason !== 'string') {
      throw new Error('Reason must be string');
    }
    
    res.json({ receipt: 'receipt', revokedItems: [], revokedAt: new Date() });
  },

  postUserConsentsGrant: (req, res) => {
    // Test request body types
    const { domain, agreementId, agreementVersion, consentItemIds } = req.body;
    
    // Test required fields
    if (typeof domain !== 'string') {
      throw new Error('Domain must be string');
    }
    
    if (typeof agreementId !== 'string') {
      throw new Error('Agreement ID must be string');
    }
    
    if (typeof agreementVersion !== 'string') {
      throw new Error('Agreement version must be string');
    }
    
    if (!Array.isArray(consentItemIds)) {
      throw new Error('Consent item IDs must be array');
    }
    
    consentItemIds.forEach(id => {
      if (typeof id !== 'string') {
        throw new Error('Consent item ID must be string');
      }
    });
    
    res.json({ receipt: 'receipt', grantedItems: [], grantedAt: new Date() });
  },

  getUserHistory: (req, res) => {
    // Test query parameter types
    const { domain, actionType, startDate, endDate, pageToken } = req.query;
    
    // Test enum values
    if (actionType && !['grant', 'revoke', 'update'].includes(actionType)) {
      throw new Error('Invalid action type');
    }
    
    // Test date format strings
    if (startDate && typeof startDate === 'string') {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new Error('Invalid start date format');
      }
    }
    
    if (endDate && typeof endDate === 'string') {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw new Error('Invalid end date format');
      }
    }
    
    res.json({ history: [], nextPageToken: undefined });
  },

  postUserReceiptsVerify: (req, res) => {
    // Test request body types
    const { receipt } = req.body;
    
    if (typeof receipt !== 'string') {
      throw new Error('Receipt must be string');
    }
    
    res.json({
      isValid: true,
      signatureValid: true,
      timestamp: new Date(),
      verificationDetails: {},
      receiptData: {
        userId: 'user-123',
        domain: 'example.com',
        action: 'grant',
        consentItems: [],
        agreement: {
          id: 'agreement-1',
          name: 'Privacy Policy',
          version: '1.0.0',
          source: 'direct',
          createdAt: new Date(),
          content: '<p>Content</p>'
        },
        timestamp: new Date()
      }
    });
  },

  getUserNotificationsPreferences: (req, res) => {
    res.json({
      emailEnabled: true,
      emailFrequency: 'daily',
      smsEnabled: false,
      pushEnabled: true,
      notificationTypes: ['consentChanges', 'agreementUpdates']
    });
  },

  putUserNotificationsPreferences: (req, res) => {
    // Test request body types
    const { emailEnabled, emailFrequency, smsEnabled, pushEnabled, notificationTypes } = req.body;
    
    // Test enum values
    if (emailFrequency && !['immediate', 'daily', 'weekly', 'never'].includes(emailFrequency)) {
      throw new Error('Invalid email frequency');
    }
    
    if (notificationTypes && Array.isArray(notificationTypes)) {
      notificationTypes.forEach(type => {
        if (!['consentChanges', 'agreementUpdates', 'securityAlerts'].includes(type)) {
          throw new Error('Invalid notification type');
        }
      });
    }
    
    res.json({
      emailEnabled: emailEnabled || true,
      emailFrequency: emailFrequency || 'daily',
      smsEnabled: smsEnabled || false,
      pushEnabled: pushEnabled || true,
      notificationTypes: notificationTypes || ['consentChanges']
    });
  },

  getUserNotificationsLedger: (req, res) => {
    // Test query parameter types
    const { notificationType, startDate, endDate, pageToken } = req.query;
    
    // Test enum values
    if (notificationType && !['email', 'sms', 'push'].includes(notificationType)) {
      throw new Error('Invalid notification type');
    }
    
    res.json({ notifications: [], nextPageToken: undefined });
  },

  // Management API Endpoints
  getAdminAgreements: (req, res) => {
    // Test query parameter types
    const { status, domain, pageToken } = req.query;
    
    // Test enum values
    if (status && !['draft', 'active', 'archived'].includes(status)) {
      throw new Error('Invalid status');
    }
    
    res.json({ agreements: [], nextPageToken: undefined });
  },

  postAdminAgreements: (req, res) => {
    // Test request body types
    const { name, domain, content, consentItems } = req.body;
    
    if (typeof name !== 'string') {
      throw new Error('Name must be string');
    }
    
    if (typeof domain !== 'string') {
      throw new Error('Domain must be string');
    }
    
    if (typeof content !== 'string') {
      throw new Error('Content must be string');
    }
    
    if (!Array.isArray(consentItems)) {
      throw new Error('Consent items must be array');
    }
    
    res.status(201).json({
      id: 'agreement-new',
      name,
      version: '1.0.0',
      status: 'draft',
      domain,
      content,
      consentItems,
      acceptanceCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  getAdminAgreementsByAgreementId: (req, res) => {
    // Test path parameter types
    const { agreementId } = req.params;
    
    if (typeof agreementId !== 'string') {
      throw new Error('Agreement ID must be string');
    }
    
    res.json({
      id: agreementId,
      name: 'Privacy Policy',
      version: '1.0.0',
      status: 'active',
      domain: 'example.com',
      content: '<p>Content</p>',
      consentItems: [],
      acceptanceCount: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date()
    });
  },

  putAdminAgreementsByAgreementId: (req, res) => {
    // Test path parameter types
    const { agreementId } = req.params;
    
    if (typeof agreementId !== 'string') {
      throw new Error('Agreement ID must be string');
    }
    
    // Test request body types
    const { name, content, consentItems } = req.body;
    
    res.json({
      id: agreementId,
      name: name || 'Updated Privacy Policy',
      version: '1.1.0',
      status: 'draft',
      domain: 'example.com',
      content: content || '<p>Updated content</p>',
      consentItems: consentItems || [],
      acceptanceCount: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  postAdminAgreementsByAgreementIdPublish: (req, res) => {
    // Test path parameter types
    const { agreementId } = req.params;
    
    if (typeof agreementId !== 'string') {
      throw new Error('Agreement ID must be string');
    }
    
    res.json({
      id: agreementId,
      name: 'Privacy Policy',
      version: '1.0.0',
      status: 'active',
      domain: 'example.com',
      content: '<p>Content</p>',
      consentItems: [],
      acceptanceCount: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date()
    });
  },

  getAdminDomains: (req, res) => {
    // Test query parameter types
    const { status } = req.query;
    
    // Test enum values
    if (status && !['pending', 'active', 'deactivated'].includes(status)) {
      throw new Error('Invalid status');
    }
    
    res.json({ domains: [], totalCount: 0 });
  },

  postAdminDomains: (req, res) => {
    // Test request body types
    const { name, fqdn } = req.body;
    
    if (typeof name !== 'string') {
      throw new Error('Name must be string');
    }
    
    if (typeof fqdn !== 'string') {
      throw new Error('FQDN must be string');
    }
    
    res.status(201).json({
      id: 'domain-new',
      name,
      fqdn,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  putAdminDomainsByDomainId: (req, res) => {
    // Test path parameter types
    const { domainId } = req.params;
    
    if (typeof domainId !== 'string') {
      throw new Error('Domain ID must be string');
    }
    
    // Test request body types
    const { name, status } = req.body;
    
    // Test enum values
    if (status && status !== 'deactivated') {
      throw new Error('Status can only be set to deactivated');
    }
    
    res.json({
      id: domainId,
      name: name || 'Updated Domain',
      fqdn: 'example.com',
      status: status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  postAdminImportConsents: (req, res) => {
    // Test request body types
    const { domain, agreementId, overwriteExisting } = req.body;
    
    if (typeof domain !== 'string') {
      throw new Error('Domain must be string');
    }
    
    if (typeof agreementId !== 'string') {
      throw new Error('Agreement ID must be string');
    }
    
    if (overwriteExisting !== undefined && typeof overwriteExisting !== 'boolean') {
      throw new Error('Overwrite existing must be boolean');
    }
    
    res.status(202).json({
      jobId: 'import-job-123',
      status: 'pending',
      totalRecords: 100,
      processedRecords: 0,
      createdAt: new Date()
    });
  },

  getAdminUsers: (req, res) => {
    // Test query parameter types
    const { email, domain, pageToken } = req.query;
    
    res.json({ users: [], nextPageToken: undefined });
  },

  getAdminUsersByUserId: (req, res) => {
    // Test path parameter types
    const { userId } = req.params;
    
    if (typeof userId !== 'string') {
      throw new Error('User ID must be string');
    }
    
    res.json({
      id: userId,
      email: 'user@example.com',
      domains: ['example.com'],
      consents: [],
      consentHistory: []
    });
  },

  getAdminActivityLogs: (req, res) => {
    // Test query parameter types
    const { actionType, userId, startDate, endDate, pageToken } = req.query;
    
    res.json({ logs: [], nextPageToken: undefined });
  },

  getAdminDashboard: (req, res) => {
    res.json({
      totalAgreements: 5,
      activeAgreements: 3,
      totalConsents: 150,
      recentActivityCount: 10,
      domains: [
        {
          domain: 'example.com',
          consentCount: 100,
          userCount: 50,
          status: 'active'
        }
      ]
    });
  },

  // Audit API Endpoints
  postAuditReceiptsVerify: (req, res) => {
    // Test request body types
    const { receipt } = req.body;
    
    if (typeof receipt !== 'string') {
      throw new Error('Receipt must be string');
    }
    
    res.json({
      isValid: true,
      signatureValid: true,
      timestamp: new Date(),
      verificationDetails: {},
      receiptData: {
        userId: 'user-123',
        domain: 'example.com',
        action: 'grant',
        consentItems: [],
        agreement: {
          id: 'agreement-1',
          name: 'Privacy Policy',
          version: '1.0.0',
          source: 'direct',
          createdAt: new Date(),
          content: '<p>Content</p>'
        },
        timestamp: new Date()
      }
    });
  }
};

// Test that all handlers are callable
console.log('All handlers are properly typed and callable');

export default testHandlers; 