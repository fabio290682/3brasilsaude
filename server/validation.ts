import { z } from 'zod';

export const donorSchema = z.object({
  photo: z.string().optional(),
  name: z.string().min(1),
  id: z.string().min(1),
  birthDate: z.string().optional(),
  age: z.number().optional(),
  sex: z.string().optional(),
  donorClass: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  bloodGroup: z.string().optional(),
  rhFactor: z.string().optional(),
  pai: z.string().optional(),
  iai: z.string().optional(),
  phenotyping: z.string().optional(),
  ehResult: z.string().optional(),
  hbsResult: z.string().optional(),
});

export const collectionSchema = z.object({
  triagem: z.string().min(1),
  coleta: z.string().min(1),
  date: z.string().min(1),
  option: z.string().min(1),
  type: z.string().min(1),
  donor: donorSchema,
  start: z.object({
    phlebotomist: z.string().min(1),
    targetQty: z.string().min(1),
    bagType: z.string().min(1),
  }),
  end: z.object({
    phlebotomist: z.string().min(1),
    actualQty: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    punctureSite: z.string().min(1),
    homogenizer: z.string().min(1),
  }),
  observations: z.object({
    collection: z.string().optional(),
    forCollection: z.string().optional(),
    fractionation: z.string().optional(),
  }).optional(),
  supplies: z.object({
    alcoholLot: z.string().min(1),
    degermantLot: z.string().min(1),
  }),
});

export const patientSchema = z.object({
  name: z.string().min(1),
  id: z.string().min(1),
  hospitalReg: z.string().optional(),
  serviceCode: z.string().optional(),
  hospitalLocation: z.string().optional(),
  transfusionClinic: z.string().optional(),
  auth: z.string().optional(),
  bloodType: z.string().optional(),
  admissionDateTime: z.string().optional(),
  agreement: z.string().optional(),
  room: z.string().optional(),
  guide: z.string().optional(),
  newborn: z.boolean().optional(),
  sequential: z.string().optional(),
  hospital: z.string().optional(),
  inpatientClinic: z.string().optional(),
  bed: z.string().optional(),
});

export const detailsSchema = z.object({
  characteristics: z.string(),
  phenotyping: z.string(),
  antibodies: z.string(),
  observations: z.string(),
  reservedBags: z.string(),
}).partial();

export const transfusionSchema = z.object({
  id: z.string().min(1),
  dateTime: z.string().min(1),
  patientStatus: z.string().optional(),
  priority: z.string().min(1),
  status: z.string().optional(),
  patient: patientSchema,
  details: detailsSchema,
});

export const vitalsSchema = z.object({
  height: z.number(),
  weight: z.number(),
  bmi: z.number(),
  bloodPressure: z.string(),
  pulse: z.number(),
  temp: z.number(),
  hemoglobin: z.number(),
  hematocrit: z.number(),
}).partial();

export const procedureSchema = z.object({
  responsible: z.string().min(1),
  startTime: z.string(),
  endTime: z.string(),
  componentRemoved: z.string(),
  bagsRemoved: z.number(),
  volumeRemoved: z.number(),
  replacementFluid1: z.string(),
  replacementFluid1Qty: z.number(),
  replacementFluid2: z.string(),
  replacementFluid2Qty: z.number(),
  destination: z.string().min(1),
  apheresisEquipment: z.string(),
  evolution: z.string(),
}).partial();

export const therapeuticSchema = z.object({
  request: z.string().min(1),
  type: z.string().min(1),
  patient: z.string().min(1),
  hospitalReg: z.string().optional(),
  doctor: z.string().optional(),
  clinic: z.string().optional(),
  hospitalOrder: z.string().optional(),
  vitalsStart: vitalsSchema,
  vitalsEnd: vitalsSchema,
  procedure: procedureSchema,
});
