export interface Note {
  id: string;
  content: string;
  iv?: string;
  salt?: string;
  isEncrypted: boolean;
  expiresAt?: Date;
  maxViews: number;
  viewCount: number;
  isDestroyed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  content: string;
  password?: string;
  expiresIn?: number;
  maxViews?: number;
}

export interface NoteResponse {
  id: string;
  content: string;
  createdAt: Date;
  viewCount: number;
  isEncrypted: boolean;
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
}

export interface CreateNoteRequest {
  content: string;
  password?: string;
  expiresIn?: number;
  maxViews?: number;
}

export interface CreateNoteResponse {
  success: boolean;
  id?: string;
  message: string;
  error?: string;
}

export interface GetNoteResponse {
  success: boolean;
  content?: string;
  createdAt?: string;
  viewCount?: number;
  isEncrypted?: boolean;
  message?: string;
  requiresPassword?: boolean;
}

export interface DeleteNoteResponse {
  success: boolean;
  message: string;
}

export interface NoteStatusResponse {
  success: boolean;
  exists?: boolean;
  isExpired?: boolean;
  maxViewsReached?: boolean;
  isEncrypted?: boolean;
  viewsLeft?: number;
  expiresAt?: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime?: number;
  version?: string;
  environment?: string;
}

export interface CreateNoteData {
  content: string;
  password?: string;
  expiresIn?: number;
  maxViews?: number;
}

export interface StatusResponse {
  success: boolean;
  exists?: boolean;
  isExpired?: boolean;
  maxViewsReached?: boolean;
  isEncrypted?: boolean;
  viewsLeft?: number;
  expiresAt?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface NoteParams {
  id: string;
}

export interface NoteQuery {
  password?: string;
}

export interface StatusQuery {
  includeMetadata?: boolean;
}

export interface GetNoteOptions {
  includeContent?: boolean;
  includeMetadata?: boolean;
  validateOnly?: boolean;
}

export interface DeleteNoteOptions {
  force?: boolean;
  reason?: string;
}

export interface NoteFilters {
  isEncrypted?: boolean;
  isExpired?: boolean;
  hasPassword?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  maxViewsReached?: boolean;
}

export interface NotePagination {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "expiresAt" | "viewCount";
  sortOrder?: "asc" | "desc";
}

export interface NoteListResponse {
  success: boolean;
  notes?: Note[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

export interface NoteStatsResponse {
  success: boolean;
  stats?: {
    total: number;
    active: number;
    expired: number;
    destroyed: number;
    encrypted: number;
    totalViews: number;
    averageViews: number;
  };
  message?: string;
}

export interface BulkDeleteResponse {
  success: boolean;
  deleted?: number;
  failed?: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
  message?: string;
}

export interface NotificationPreferences {
  emailOnExpiry?: boolean;
  emailOnView?: boolean;
  webhookUrl?: string;
  slackWebhook?: string;
}

export interface UserPreferences {
  defaultMaxViews?: number;
  defaultExpiresIn?: number;
  defaultEncryption?: boolean;
  notifications?: NotificationPreferences;
  theme?: "light" | "dark" | "auto";
  language?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface RequestMetadata {
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  timestamp: Date;
  requestId: string;
}

export interface AuditLog {
  id: string;
  action: "create" | "read" | "delete" | "expire";
  noteId: string;
  metadata?: RequestMetadata;
  success: boolean;
  error?: string;
  createdAt: Date;
}

export interface BackupData {
  version: string;
  exportedAt: Date;
  notes: Note[];
  auditLogs?: AuditLog[];
  checksum: string;
}

export interface ImportResult {
  success: boolean;
  imported?: number;
  skipped?: number;
  failed?: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
  message?: string;
}

export const NOTE_CONSTRAINTS = {
  CONTENT_MIN_LENGTH: 1,
  CONTENT_MAX_LENGTH: 50000,
  PASSWORD_MIN_LENGTH: 1,
  PASSWORD_MAX_LENGTH: 100,
  MAX_VIEWS_MIN: 1,
  MAX_VIEWS_MAX: 1000,
  EXPIRES_IN_MIN: 1000,
  EXPIRES_IN_MAX: 365 * 24 * 60 * 60 * 1000,
  ID_LENGTH: 25,
  SALT_LENGTH: 32,
  IV_LENGTH: 16,
  KEY_LENGTH: 32,
  PBKDF2_ITERATIONS: 100000,
} as const;

export const API_CONSTRAINTS = {
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 100,
  REQUEST_TIMEOUT: 30000,
  MAX_PAYLOAD_SIZE: 1024 * 1024,
  SUPPORTED_LANGUAGES: ["en", "de", "fr", "es", "it", "pt"] as const,
} as const;

export const CRYPTO_CONFIG = {
  ALGORITHM: "aes-256-cbc",
  HASH_ALGORITHM: "sha512",
  PBKDF2_ITERATIONS: NOTE_CONSTRAINTS.PBKDF2_ITERATIONS,
  SALT_LENGTH: NOTE_CONSTRAINTS.SALT_LENGTH,
  IV_LENGTH: NOTE_CONSTRAINTS.IV_LENGTH,
  KEY_LENGTH: NOTE_CONSTRAINTS.KEY_LENGTH,
} as const;

export type NoteStatus =
  | "active"
  | "expired"
  | "destroyed"
  | "max_views_reached";

export type Theme = "light" | "dark" | "auto";

export type SortOrder = "asc" | "desc";

export type NoteAction = "create" | "read" | "delete" | "expire" | "cleanup";

export type SupportedLanguage =
  (typeof API_CONSTRAINTS.SUPPORTED_LANGUAGES)[number];

export type EncryptionAlgorithm = typeof CRYPTO_CONFIG.ALGORITHM;

export type HashAlgorithm = typeof CRYPTO_CONFIG.HASH_ALGORITHM;

export type OperationResult<T = unknown> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      error: string;
      code?: string;
    };

export type AsyncOperationResult<T = unknown> = Promise<OperationResult<T>>;

export interface TypedError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface QueueJob {
  id: string;
  type: "cleanup" | "notification" | "backup";
  payload: Record<string, unknown>;
  priority: number;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledFor?: Date;
  completedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface WebhookPayload {
  event: "note.created" | "note.viewed" | "note.expired" | "note.deleted";
  noteId: string;
  timestamp: string;
  data?: Record<string, unknown>;
  signature?: string;
}

export interface Feature {
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface AppConfig {
  features: Feature[];
  maintenance: {
    enabled: boolean;
    message?: string;
    until?: Date;
  };
  limits: {
    maxNotesPerIp: number;
    maxNotesPerHour: number;
    cleanupInterval: number;
  };
  security: {
    requireHttps: boolean;
    allowedOrigins: string[];
    csrfProtection: boolean;
  };
}

export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  ssl: boolean;
  poolSize: number;
  timeout: number;
}

export interface RedisConnection {
  host: string;
  port: number;
  password?: string;
  database: number;
  keyPrefix: string;
}

export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun";
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origins: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  security: {
    helmet: boolean;
    trustProxy: boolean;
  };
}
