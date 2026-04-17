import mongoose from 'mongoose';

const VitalsSchema = new mongoose.Schema(
  {
    height: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    bloodPressure: { type: String },
    pulse: { type: Number },
    temp: { type: Number },
    hemoglobin: { type: Number },
    hematocrit: { type: Number },
  },
  { _id: false }
);

const ProcedureSchema = new mongoose.Schema(
  {
    responsible: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    componentRemoved: { type: String },
    bagsRemoved: { type: Number },
    volumeRemoved: { type: Number },
    replacementFluid1: { type: String },
    replacementFluid1Qty: { type: Number },
    replacementFluid2: { type: String },
    replacementFluid2Qty: { type: Number },
    destination: { type: String, required: true },
    apheresisEquipment: { type: String },
    evolution: { type: String },
  },
  { _id: false }
);

const TherapeuticSchema = new mongoose.Schema(
  {
    request: { type: String, required: true },
    type: { type: String, required: true },
    patient: { type: String, required: true },
    hospitalReg: String,
    doctor: String,
    clinic: String,
    hospitalOrder: String,
    vitalsStart: { type: VitalsSchema, required: true },
    vitalsEnd: { type: VitalsSchema, required: true },
    procedure: { type: ProcedureSchema, required: true },
  },
  { timestamps: true }
);

TherapeuticSchema.index({ request: 1 });
TherapeuticSchema.index({ 'procedure.responsible': 1 });

export const TherapeuticModel = mongoose.models.Therapeutic || mongoose.model('Therapeutic', TherapeuticSchema);
