import { z } from 'zod';

export const createJobSchema = z.object({
  oeNumber: z.string().min(1, "OE# is required"),
  clientId: z.string().min(1, "Client is required"),
  csrId: z.string().min(1, "CSR is required"),
  shipDate: z.string().transform(str => new Date(str)),
  rush24hr: z.boolean().default(false),
  prePro: z.boolean().default(false),
  needPhoto: z.boolean().default(false),
  notes: z.string().optional(),
  courier: z.string().optional(),
  productId: z.string().min(1, "Product ID is required"),
  qtyTotal: z.number().min(1, "Quantity must be at least 1"),
  locations: z.array(z.object({
    name: z.enum(['Front', 'Back', 'Sleeve', 'Tag']),
    widthIn: z.number().positive(),
    heightIn: z.number().positive(),
    colors: z.number().min(1),
    pms: z.array(z.string()),
    underbase: z.boolean().default(false),
    halftoneLpi: z.number().optional(),
    placementNote: z.string().optional(),
  })).min(1, "At least one print location is required"),
  sizeBreakdown: z.record(z.string(), z.number()),
});

export const updateJobStatusSchema = z.object({
  status: z.enum([
    'NEW',
    'WAITING_ARTWORK',
    'READY_FOR_PRESS',
    'IN_PRESS',
    'QC',
    'PACKED',
    'SHIPPED',
    'HOLD',
    'EXCEPTION'
  ]),
  overrideReason: z.string().optional(),
});

export const proofUploadSchema = z.object({
  jobId: z.string(),
  file: z.any(), // File upload
  version: z.number().optional(),
});

export const proofApprovalSchema = z.object({
  proofId: z.string(),
  status: z.enum(['APPROVED', 'CHANGES_REQUESTED']),
  approvedBy: z.string(),
  approverEmail: z.string().email(),
  notes: z.string().optional(),
});

export const qcRecordSchema = z.object({
  jobId: z.string(),
  exitTempF: z.number().optional(),
  passed: z.boolean(),
  defects: z.number().min(0).default(0),
  reasons: z.array(z.string()).optional(),
  photoUrl: z.string().optional(),
});

export const pressSetupSchema = z.object({
  jobId: z.string(),
  pressId: z.string(),
  platen: z.string().optional(),
  squeegeeDurometer: z.number().optional(),
  strokes: z.number().optional(),
  offContact: z.number().optional(),
  flashTimeMs: z.number().optional(),
  testPrintPass: z.boolean().default(false),
});

export const screenSpecSchema = z.object({
  jobId: z.string(),
  screenId: z.string(),
  mesh: z.number().min(1),
  tensionN: z.number().optional(),
  emulsion: z.string().optional(),
  exposureSec: z.number().optional(),
  reclaimStatus: z.string().optional(),
});

export const inkSpecSchema = z.object({
  jobId: z.string(),
  name: z.string().min(1),
  pms: z.string().optional(),
  type: z.enum(['plastisol', 'water-based', 'discharge']),
  flashTempF: z.number().optional(),
  cureTempF: z.number().optional(),
  additives: z.string().optional(),
});

export const shipmentSchema = z.object({
  jobId: z.string(),
  courier: z.string().min(1),
  tracking: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobStatusInput = z.infer<typeof updateJobStatusSchema>;
export type ProofUploadInput = z.infer<typeof proofUploadSchema>;
export type ProofApprovalInput = z.infer<typeof proofApprovalSchema>;
export type QCRecordInput = z.infer<typeof qcRecordSchema>;
export type PressSetupInput = z.infer<typeof pressSetupSchema>;
export type ScreenSpecInput = z.infer<typeof screenSpecSchema>;
export type InkSpecInput = z.infer<typeof inkSpecSchema>;
export type ShipmentInput = z.infer<typeof shipmentSchema>;