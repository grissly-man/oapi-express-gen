// AUTO-GENERATED - DO NOT EDIT
// Generated from OpenAPI spec: Euler Managed Consent API v1.0.0

import { Request, Response, Express } from "express";

// Generated from OpenAPI spec: Euler Managed Consent API v1.0.0

// Path parameter types
export interface getUserConsentsByDomainPathParams {
  domain: string;
  
}
export interface getAdminAgreementsByAgreementIdPathParams {
  agreementId: string;
  
}
export interface putAdminAgreementsByAgreementIdPathParams {
  agreementId: string;
  
}
export interface postAdminAgreementsByAgreementIdPublishPathParams {
  agreementId: string;
  
}
export interface putAdminDomainsByDomainIdPathParams {
  domainId: string;
  
}
export interface getAdminUsersByUserIdPathParams {
  userId: string;
  
}

// Query parameter types
export interface getUserConsentsQueryParams {
  includeInactive?: boolean;
  pageToken?: string;
  
}
export interface getUserConsentsByDomainQueryParams {
  includeInactive?: boolean;
  
}
export interface getUserHistoryQueryParams {
  domain?: string;
  actionType?: 'grant' | 'revoke' | 'update';
  startDate?: Date;
  endDate?: Date;
  pageToken?: string;
  
}
export interface getUserNotificationsLedgerQueryParams {
  notificationType?: 'email' | 'sms' | 'push';
  startDate?: Date;
  endDate?: Date;
  pageToken?: string;
  
}
export interface getAdminAgreementsQueryParams {
  status?: 'draft' | 'active' | 'archived';
  domain?: string;
  pageToken?: string;
  
}
export interface getAdminDomainsQueryParams {
  status?: 'pending' | 'active' | 'deactivated';
  
}
export interface getAdminUsersQueryParams {
  email?: string;
  domain?: string;
  pageToken?: string;
  
}
export interface getAdminActivityLogsQueryParams {
  actionType?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  pageToken?: string;
  
}

// Request body types
export interface postUserConsentsRevokeBody {
  domain: string;
  agreementId: string;
  agreementVersion: string;
  consentItemIds?: string[];
  reason?: string;
  [key: string]: any;
}
export interface postUserConsentsGrantBody {
  domain: string;
  agreementId: string;
  agreementVersion: string;
  consentItemIds: string[];
  [key: string]: any;
}
export interface postUserReceiptsVerifyBody {
  receipt: string;
  [key: string]: any;
}
export interface putUserNotificationsPreferencesBody {
  emailEnabled?: boolean;
  emailFrequency?: 'immediate' | 'daily' | 'weekly' | 'never';
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  notificationTypes?: ('consentChanges' | 'agreementUpdates' | 'securityAlerts')[];
  [key: string]: any;
}
export interface postAdminAgreementsBody {
  name: string;
  domain: string;
  content: string;
  consentItems: any[];
  [key: string]: any;
}
export interface putAdminAgreementsByAgreementIdBody {
  name?: string;
  content?: string;
  consentItems?: any[];
  [key: string]: any;
}
export interface postAdminDomainsBody {
  name: string;
  fqdn: string;
  [key: string]: any;
}
export interface putAdminDomainsByDomainIdBody {
  name?: string;
  status?: 'deactivated';
  [key: string]: any;
}
export interface postAdminImportConsentsBody {
  file?: string;
  domain?: string;
  agreementId?: string;
  overwriteExisting?: boolean;
  [key: string]: any;
}
export interface postAuditReceiptsVerifyBody {
  receipt: string;
  [key: string]: any;
}

// Response types
export interface getUserConsentsResponse {
  consents?: any[];
  nextPageToken?: string;
  [key: string]: any;
}
export interface getUserConsentsByDomainResponse {
  consents?: any[];
  nextPageToken?: string;
  [key: string]: any;
}
export interface postUserConsentsRevokeResponse {
  receipt?: string;
  revokedItems?: string[];
  revokedAt?: Date;
  [key: string]: any;
}
export interface postUserConsentsGrantResponse {
  receipt?: string;
  grantedItems?: string[];
  grantedAt?: Date;
  [key: string]: any;
}
export interface getUserHistoryResponse {
  history?: any[];
  nextPageToken?: string;
  [key: string]: any;
}
export interface postUserReceiptsVerifyResponse {
  isValid?: boolean;
  signatureValid?: boolean;
  timestamp?: Date;
  verificationDetails?: Record<string, any>;
  [key: string]: any;
}
export interface getUserNotificationsPreferencesResponse {
  emailEnabled?: boolean;
  emailFrequency?: 'immediate' | 'daily' | 'weekly' | 'never';
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  notificationTypes?: ('consentChanges' | 'agreementUpdates' | 'securityAlerts')[];
  [key: string]: any;
}
export interface putUserNotificationsPreferencesResponse {
  emailEnabled?: boolean;
  emailFrequency?: 'immediate' | 'daily' | 'weekly' | 'never';
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  notificationTypes?: ('consentChanges' | 'agreementUpdates' | 'securityAlerts')[];
  [key: string]: any;
}
export interface getUserNotificationsLedgerResponse {
  notifications?: any[];
  nextPageToken?: string;
  [key: string]: any;
}
export interface getAdminAgreementsResponse {
  agreements?: any[];
  nextPageToken?: string;
  [key: string]: any;
}
export interface postAdminAgreementsResponse {
  id?: string;
  name?: string;
  version?: string;
  status?: 'draft' | 'active' | 'archived';
  domain?: string;
  content?: string;
  consentItems?: any[];
  acceptanceCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  [key: string]: any;
}
export interface getAdminAgreementsByAgreementIdResponse {
  id?: string;
  name?: string;
  version?: string;
  status?: 'draft' | 'active' | 'archived';
  domain?: string;
  content?: string;
  consentItems?: any[];
  acceptanceCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  [key: string]: any;
}
export interface putAdminAgreementsByAgreementIdResponse {
  id?: string;
  name?: string;
  version?: string;
  status?: 'draft' | 'active' | 'archived';
  domain?: string;
  content?: string;
  consentItems?: any[];
  acceptanceCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  [key: string]: any;
}
export interface postAdminAgreementsByAgreementIdPublishResponse {
  id?: string;
  name?: string;
  version?: string;
  status?: 'draft' | 'active' | 'archived';
  domain?: string;
  content?: string;
  consentItems?: any[];
  acceptanceCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  [key: string]: any;
}
export interface getAdminDomainsResponse {
  domains?: any[];
  totalCount?: number;
  [key: string]: any;
}
export interface postAdminDomainsResponse {
  id?: string;
  name?: string;
  fqdn?: string;
  status?: 'pending' | 'active' | 'deactivated';
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}
export interface putAdminDomainsByDomainIdResponse {
  id?: string;
  name?: string;
  fqdn?: string;
  status?: 'pending' | 'active' | 'deactivated';
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}
export interface getAdminUsersResponse {
  users?: any[];
  nextPageToken?: string;
  [key: string]: any;
}
export interface getAdminUsersByUserIdResponse {
  id?: string;
  email?: string;
  domains?: string[];
  consents?: any[];
  consentHistory?: any[];
  [key: string]: any;
}
export interface getAdminActivityLogsResponse {
  logs?: any[];
  nextPageToken?: string;
  [key: string]: any;
}
export interface getAdminDashboardResponse {
  totalAgreements?: number;
  activeAgreements?: number;
  totalConsents?: number;
  recentActivityCount?: number;
  domains?: any[];
  [key: string]: any;
}
export interface postAuditReceiptsVerifyResponse {
  isValid?: boolean;
  signatureValid?: boolean;
  timestamp?: Date;
  verificationDetails?: Record<string, any>;
  [key: string]: any;
}


// Request types for each operation
export type getUserConsentsRequest = Request<
  {},
  getUserConsentsResponse,
  {},
  getUserConsentsQueryParams
>;
export type getUserConsentsByDomainRequest = Request<
  getUserConsentsByDomainPathParams,
  getUserConsentsByDomainResponse,
  {},
  getUserConsentsByDomainQueryParams
>;
export type postUserConsentsRevokeRequest = Request<
  {},
  postUserConsentsRevokeResponse,
  postUserConsentsRevokeBody,
  {}
>;
export type postUserConsentsGrantRequest = Request<
  {},
  postUserConsentsGrantResponse,
  postUserConsentsGrantBody,
  {}
>;
export type getUserHistoryRequest = Request<
  {},
  getUserHistoryResponse,
  {},
  getUserHistoryQueryParams
>;
export type postUserReceiptsVerifyRequest = Request<
  {},
  postUserReceiptsVerifyResponse,
  postUserReceiptsVerifyBody,
  {}
>;
export type getUserNotificationsPreferencesRequest = Request<
  {},
  getUserNotificationsPreferencesResponse,
  {},
  {}
>;
export type putUserNotificationsPreferencesRequest = Request<
  {},
  putUserNotificationsPreferencesResponse,
  putUserNotificationsPreferencesBody,
  {}
>;
export type getUserNotificationsLedgerRequest = Request<
  {},
  getUserNotificationsLedgerResponse,
  {},
  getUserNotificationsLedgerQueryParams
>;
export type getAdminAgreementsRequest = Request<
  {},
  getAdminAgreementsResponse,
  {},
  getAdminAgreementsQueryParams
>;
export type postAdminAgreementsRequest = Request<
  {},
  postAdminAgreementsResponse,
  postAdminAgreementsBody,
  {}
>;
export type getAdminAgreementsByAgreementIdRequest = Request<
  getAdminAgreementsByAgreementIdPathParams,
  getAdminAgreementsByAgreementIdResponse,
  {},
  {}
>;
export type putAdminAgreementsByAgreementIdRequest = Request<
  putAdminAgreementsByAgreementIdPathParams,
  putAdminAgreementsByAgreementIdResponse,
  putAdminAgreementsByAgreementIdBody,
  {}
>;
export type postAdminAgreementsByAgreementIdPublishRequest = Request<
  postAdminAgreementsByAgreementIdPublishPathParams,
  postAdminAgreementsByAgreementIdPublishResponse,
  {},
  {}
>;
export type getAdminDomainsRequest = Request<
  {},
  getAdminDomainsResponse,
  {},
  getAdminDomainsQueryParams
>;
export type postAdminDomainsRequest = Request<
  {},
  postAdminDomainsResponse,
  postAdminDomainsBody,
  {}
>;
export type putAdminDomainsByDomainIdRequest = Request<
  putAdminDomainsByDomainIdPathParams,
  putAdminDomainsByDomainIdResponse,
  putAdminDomainsByDomainIdBody,
  {}
>;
export type postAdminImportConsentsRequest = Request<
  {},
  {},
  postAdminImportConsentsBody,
  {}
>;
export type getAdminUsersRequest = Request<
  {},
  getAdminUsersResponse,
  {},
  getAdminUsersQueryParams
>;
export type getAdminUsersByUserIdRequest = Request<
  getAdminUsersByUserIdPathParams,
  getAdminUsersByUserIdResponse,
  {},
  {}
>;
export type getAdminActivityLogsRequest = Request<
  {},
  getAdminActivityLogsResponse,
  {},
  getAdminActivityLogsQueryParams
>;
export type getAdminDashboardRequest = Request<
  {},
  getAdminDashboardResponse,
  {},
  {}
>;
export type postAuditReceiptsVerifyRequest = Request<
  {},
  postAuditReceiptsVerifyResponse,
  postAuditReceiptsVerifyBody,
  {}
>;

// Response types for each operation
export type getUserConsentsResponseType = Response<getUserConsentsResponse>
export type getUserConsentsByDomainResponseType = Response<getUserConsentsByDomainResponse>
export type postUserConsentsRevokeResponseType = Response<postUserConsentsRevokeResponse>
export type postUserConsentsGrantResponseType = Response<postUserConsentsGrantResponse>
export type getUserHistoryResponseType = Response<getUserHistoryResponse>
export type postUserReceiptsVerifyResponseType = Response<postUserReceiptsVerifyResponse>
export type getUserNotificationsPreferencesResponseType = Response<getUserNotificationsPreferencesResponse>
export type putUserNotificationsPreferencesResponseType = Response<putUserNotificationsPreferencesResponse>
export type getUserNotificationsLedgerResponseType = Response<getUserNotificationsLedgerResponse>
export type getAdminAgreementsResponseType = Response<getAdminAgreementsResponse>
export type postAdminAgreementsResponseType = Response<postAdminAgreementsResponse>
export type getAdminAgreementsByAgreementIdResponseType = Response<getAdminAgreementsByAgreementIdResponse>
export type putAdminAgreementsByAgreementIdResponseType = Response<putAdminAgreementsByAgreementIdResponse>
export type postAdminAgreementsByAgreementIdPublishResponseType = Response<postAdminAgreementsByAgreementIdPublishResponse>
export type getAdminDomainsResponseType = Response<getAdminDomainsResponse>
export type postAdminDomainsResponseType = Response<postAdminDomainsResponse>
export type putAdminDomainsByDomainIdResponseType = Response<putAdminDomainsByDomainIdResponse>
export type postAdminImportConsentsResponseType = Response
export type getAdminUsersResponseType = Response<getAdminUsersResponse>
export type getAdminUsersByUserIdResponseType = Response<getAdminUsersByUserIdResponse>
export type getAdminActivityLogsResponseType = Response<getAdminActivityLogsResponse>
export type getAdminDashboardResponseType = Response<getAdminDashboardResponse>
export type postAuditReceiptsVerifyResponseType = Response<postAuditReceiptsVerifyResponse>

// Handler function types
export type Handlers = {
  getUserConsents: (req: getUserConsentsRequest, res: getUserConsentsResponseType) => void | Promise<void> | getUserConsentsResponseType;
  getUserConsentsByDomain: (req: getUserConsentsByDomainRequest, res: getUserConsentsByDomainResponseType) => void | Promise<void> | getUserConsentsByDomainResponseType;
  postUserConsentsRevoke: (req: postUserConsentsRevokeRequest, res: postUserConsentsRevokeResponseType) => void | Promise<void> | postUserConsentsRevokeResponseType;
  postUserConsentsGrant: (req: postUserConsentsGrantRequest, res: postUserConsentsGrantResponseType) => void | Promise<void> | postUserConsentsGrantResponseType;
  getUserHistory: (req: getUserHistoryRequest, res: getUserHistoryResponseType) => void | Promise<void> | getUserHistoryResponseType;
  postUserReceiptsVerify: (req: postUserReceiptsVerifyRequest, res: postUserReceiptsVerifyResponseType) => void | Promise<void> | postUserReceiptsVerifyResponseType;
  getUserNotificationsPreferences: (req: getUserNotificationsPreferencesRequest, res: getUserNotificationsPreferencesResponseType) => void | Promise<void> | getUserNotificationsPreferencesResponseType;
  putUserNotificationsPreferences: (req: putUserNotificationsPreferencesRequest, res: putUserNotificationsPreferencesResponseType) => void | Promise<void> | putUserNotificationsPreferencesResponseType;
  getUserNotificationsLedger: (req: getUserNotificationsLedgerRequest, res: getUserNotificationsLedgerResponseType) => void | Promise<void> | getUserNotificationsLedgerResponseType;
  getAdminAgreements: (req: getAdminAgreementsRequest, res: getAdminAgreementsResponseType) => void | Promise<void> | getAdminAgreementsResponseType;
  postAdminAgreements: (req: postAdminAgreementsRequest, res: postAdminAgreementsResponseType) => void | Promise<void> | postAdminAgreementsResponseType;
  getAdminAgreementsByAgreementId: (req: getAdminAgreementsByAgreementIdRequest, res: getAdminAgreementsByAgreementIdResponseType) => void | Promise<void> | getAdminAgreementsByAgreementIdResponseType;
  putAdminAgreementsByAgreementId: (req: putAdminAgreementsByAgreementIdRequest, res: putAdminAgreementsByAgreementIdResponseType) => void | Promise<void> | putAdminAgreementsByAgreementIdResponseType;
  postAdminAgreementsByAgreementIdPublish: (req: postAdminAgreementsByAgreementIdPublishRequest, res: postAdminAgreementsByAgreementIdPublishResponseType) => void | Promise<void> | postAdminAgreementsByAgreementIdPublishResponseType;
  getAdminDomains: (req: getAdminDomainsRequest, res: getAdminDomainsResponseType) => void | Promise<void> | getAdminDomainsResponseType;
  postAdminDomains: (req: postAdminDomainsRequest, res: postAdminDomainsResponseType) => void | Promise<void> | postAdminDomainsResponseType;
  putAdminDomainsByDomainId: (req: putAdminDomainsByDomainIdRequest, res: putAdminDomainsByDomainIdResponseType) => void | Promise<void> | putAdminDomainsByDomainIdResponseType;
  postAdminImportConsents: (req: postAdminImportConsentsRequest, res: postAdminImportConsentsResponseType) => void | Promise<void> | postAdminImportConsentsResponseType;
  getAdminUsers: (req: getAdminUsersRequest, res: getAdminUsersResponseType) => void | Promise<void> | getAdminUsersResponseType;
  getAdminUsersByUserId: (req: getAdminUsersByUserIdRequest, res: getAdminUsersByUserIdResponseType) => void | Promise<void> | getAdminUsersByUserIdResponseType;
  getAdminActivityLogs: (req: getAdminActivityLogsRequest, res: getAdminActivityLogsResponseType) => void | Promise<void> | getAdminActivityLogsResponseType;
  getAdminDashboard: (req: getAdminDashboardRequest, res: getAdminDashboardResponseType) => void | Promise<void> | getAdminDashboardResponseType;
  postAuditReceiptsVerify: (req: postAuditReceiptsVerifyRequest, res: postAuditReceiptsVerifyResponseType) => void | Promise<void> | postAuditReceiptsVerifyResponseType;
};

// Route registration helper
export const registerHandlers = (app: Express, handlers: Handlers) => {
  app.get('/user/consents', handlers.getUserConsents);
  app.get('/user/consents/:domain', handlers.getUserConsentsByDomain);
  app.post('/user/consents/revoke', handlers.postUserConsentsRevoke);
  app.post('/user/consents/grant', handlers.postUserConsentsGrant);
  app.get('/user/history', handlers.getUserHistory);
  app.post('/user/receipts/verify', handlers.postUserReceiptsVerify);
  app.get('/user/notifications/preferences', handlers.getUserNotificationsPreferences);
  app.put('/user/notifications/preferences', handlers.putUserNotificationsPreferences);
  app.get('/user/notifications/ledger', handlers.getUserNotificationsLedger);
  app.get('/admin/agreements', handlers.getAdminAgreements);
  app.post('/admin/agreements', handlers.postAdminAgreements);
  app.get('/admin/agreements/:agreementId', handlers.getAdminAgreementsByAgreementId);
  app.put('/admin/agreements/:agreementId', handlers.putAdminAgreementsByAgreementId);
  app.post('/admin/agreements/:agreementId/publish', handlers.postAdminAgreementsByAgreementIdPublish);
  app.get('/admin/domains', handlers.getAdminDomains);
  app.post('/admin/domains', handlers.postAdminDomains);
  app.put('/admin/domains/:domainId', handlers.putAdminDomainsByDomainId);
  app.post('/admin/import/consents', handlers.postAdminImportConsents);
  app.get('/admin/users', handlers.getAdminUsers);
  app.get('/admin/users/:userId', handlers.getAdminUsersByUserId);
  app.get('/admin/activityLogs', handlers.getAdminActivityLogs);
  app.get('/admin/dashboard', handlers.getAdminDashboard);
  app.post('/audit/receipts/verify', handlers.postAuditReceiptsVerify);
};

