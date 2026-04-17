import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { ZodError } from 'zod';
import { logAudit } from './utils/audit.js';
import { connectDatabase } from './db.js';
import { decryptFields, encryptFields } from './utils/encryption.js';
import { CollectionModel } from './models/Collection.js';
import { TransfusionModel } from './models/Transfusion.js';
import { TherapeuticModel } from './models/Therapeutic.js';
import { collectionSchema, transfusionSchema, therapeuticSchema } from './validation.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const staticRoot = path.resolve('angular-frontend', 'dist', 'angular-frontend');
const shouldServeStatic = process.env.NODE_ENV === 'production' && fs.existsSync(staticRoot);
const allowedOrigin = process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? '*' : '*');
const apiKey = process.env.API_KEY;

const COLLECTION_SENSITIVE_PATHS = [
  'donor.name',
  'donor.id',
  'donor.birthDate',
  'donor.motherName',
  'donor.fatherName',
  'donor.bloodGroup',
  'donor.rhFactor',
  'donor.pai',
  'donor.iai',
  'donor.phenotyping',
  'donor.ehResult',
  'donor.hbsResult',
];

const TRANSFUSION_SENSITIVE_PATHS = [
  'patient.name',
  'patient.id',
  'patient.hospitalReg',
  'patient.serviceCode',
  'patient.hospitalLocation',
  'patient.transfusionClinic',
  'patient.auth',
  'patient.bloodType',
  'patient.admissionDateTime',
  'patient.agreement',
  'patient.room',
  'patient.guide',
  'patient.hospital',
  'patient.inpatientClinic',
  'patient.bed',
  'details.characteristics',
  'details.phenotyping',
  'details.antibodies',
  'details.observations',
];

const THERAPEUTIC_SENSITIVE_PATHS = [
  'patient',
  'hospitalReg',
  'doctor',
  'clinic',
  'hospitalOrder',
  'procedure.responsible',
  'procedure.replacementFluid1',
  'procedure.replacementFluid2',
  'procedure.destination',
  'procedure.apheresisEquipment',
  'procedure.evolution',
  'vitalsStart.bloodPressure',
  'vitalsEnd.bloodPressure',
];

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-KEY'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(compression());

app.use('/api', (req: Request, res: Response, next) => {
  const start = Date.now();
  const ip = req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || 'unknown';
  const bodyKeys = req.body && typeof req.body === 'object' ? Object.keys(req.body as Record<string, unknown>) : [];
  const queryKeys = req.query && typeof req.query === 'object' ? Object.keys(req.query as Record<string, unknown>) : [];

  res.on('finish', () => {
    logAudit({
      timestamp: new Date().toISOString(),
      ip,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      user: req.headers['x-api-key'] ? 'api-key' : 'anonymous',
      bodyKeys,
      queryKeys,
    });
  });

  next();
});

if (shouldServeStatic) {
  app.use(express.static(staticRoot));
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/[<>$]/g, '');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (typeof value === 'object' && value !== null) {
    return sanitizeObject(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    sanitized[key] = sanitizeValue(value);
  }

  return sanitized;
}

app.use((req: Request, _res: Response, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query as Record<string, unknown>);
  }
  next();
});

if (apiKey) {
  app.use('/api', (req: Request, res: Response, next) => {
    const requestKey = String(req.headers['x-api-key'] || '');
    if (requestKey !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized: missing or invalid API key.' });
    }
    next();
  });
}

const rateLimits = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 120);

app.use((req: Request, res: Response, next) => {
  const ip = req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || 'unknown';
  const now = Date.now();

  for (const [key, entry] of rateLimits) {
    if (entry.expiresAt <= now) {
      rateLimits.delete(key);
    }
  }

  const entry = rateLimits.get(ip);

  if (!entry || entry.expiresAt <= now) {
    rateLimits.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW });
  } else {
    entry.count += 1;
    rateLimits.set(ip, entry);
    if (entry.count > RATE_LIMIT_MAX) {
      res.setHeader('Retry-After', String(Math.ceil((entry.expiresAt - now) / 1000)));
      return res.status(429).json({ error: 'Too many requests. Slow down and try again later.' });
    }
  }

  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, RATE_LIMIT_MAX - (rateLimits.get(ip)?.count ?? 0))));
  next();
});

function createPostHandler(schema: any, model: any, sensitivePaths: string[], messageLabel: string) {
  return async (req: Request, res: Response) => {
    try {
      const payload = schema.parse(req.body);
      const encryptedPayload = encryptFields(payload, sensitivePaths);
      const entry = await model.create(encryptedPayload);

      logAudit({
        timestamp: new Date().toISOString(),
        ip: req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || 'unknown',
        method: req.method,
        path: req.originalUrl,
        status: 201,
        durationMs: 0,
        user: req.headers['x-api-key'] ? 'api-key' : 'anonymous',
        bodyKeys: Object.keys(payload as Record<string, unknown>),
        message: `Created ${messageLabel}`,
      });

      return res.status(201).json({ success: true, id: entry._id });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Invalid payload', details: error.errors });
      }
      return res.status(500).json({ error: `Erro ao salvar ${messageLabel} no banco de dados.` });
    }
  };
}

function createLatestHandler(model: any, sensitivePaths: string[]) {
  return async (_req: Request, res: Response) => {
    try {
      const latest = await model.findOne().sort({ createdAt: -1 }).exec();
      const data = latest ? decryptFields(latest.toObject(), sensitivePaths) : null;
      return res.json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ error: `Erro ao buscar datos de ${model.modelName.toLowerCase()}.` });
    }
  };
}

app.post('/api/collection', createPostHandler(collectionSchema, CollectionModel, COLLECTION_SENSITIVE_PATHS, 'collection entry'));
app.get('/api/collection/latest', createLatestHandler(CollectionModel, COLLECTION_SENSITIVE_PATHS));

app.post('/api/customers', createPostHandler(collectionSchema, CollectionModel, COLLECTION_SENSITIVE_PATHS, 'customer entry'));
app.get('/api/customers/latest', createLatestHandler(CollectionModel, COLLECTION_SENSITIVE_PATHS));

app.get('/api/collection/latest', async (_req: Request, res: Response) => {
  try {
    const latest = await CollectionModel.findOne().sort({ createdAt: -1 }).exec();
    const data = latest ? decryptFields(latest.toObject(), COLLECTION_SENSITIVE_PATHS) : null;
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar datos de collection.' });
  }
});

app.post('/api/transfusion', createPostHandler(transfusionSchema, TransfusionModel, TRANSFUSION_SENSITIVE_PATHS, 'transfusion entry'));
app.get('/api/transfusion/latest', createLatestHandler(TransfusionModel, TRANSFUSION_SENSITIVE_PATHS));

app.post('/api/opportunities', createPostHandler(transfusionSchema, TransfusionModel, TRANSFUSION_SENSITIVE_PATHS, 'opportunity entry'));
app.get('/api/opportunities/latest', createLatestHandler(TransfusionModel, TRANSFUSION_SENSITIVE_PATHS));

app.post('/api/therapeutic', createPostHandler(therapeuticSchema, TherapeuticModel, THERAPEUTIC_SENSITIVE_PATHS, 'therapeutic entry'));
app.get('/api/therapeutic/latest', createLatestHandler(TherapeuticModel, THERAPEUTIC_SENSITIVE_PATHS));

app.post('/api/orders', createPostHandler(therapeuticSchema, TherapeuticModel, THERAPEUTIC_SENSITIVE_PATHS, 'order entry'));
app.get('/api/orders/latest', createLatestHandler(TherapeuticModel, THERAPEUTIC_SENSITIVE_PATHS));

app.get('/api/health', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'ok' : dbState === 2 ? 'connecting' : 'down';

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: {
      state: dbStatus,
      readyState: dbState,
    },
  });
});

if (shouldServeStatic) {
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(staticRoot, 'index.html'));
  });
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Invalid request data', details: err.errors });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({ error: 'Internal server error' });
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Impossible connect to MongoDB:', error);
    process.exit(1);
  });
