import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true },
    hospitalReg: String,
    serviceCode: String,
    hospitalLocation: String,
    transfusionClinic: String,
    auth: String,
    bloodType: String,
    admissionDateTime: String,
    agreement: String,
    room: String,
    guide: String,
    newborn: Boolean,
    sequential: String,
    hospital: String,
    inpatientClinic: String,
    bed: String,
  },
  { _id: false }
);

const DetailsSchema = new mongoose.Schema(
  {
    characteristics: String,
    phenotyping: String,
    antibodies: String,
    observations: String,
    reservedBags: String,
  },
  { _id: false }
);

const TransfusionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    dateTime: { type: String, required: true },
    patientStatus: String,
    priority: { type: String, required: true },
    status: String,
    patient: { type: PatientSchema, required: true },
    details: { type: DetailsSchema, required: true },
  },
  { timestamps: true }
);

TransfusionSchema.index({ id: 1 });
TransfusionSchema.index({ dateTime: -1 });

export const TransfusionModel = mongoose.models.Transfusion || mongoose.model('Transfusion', TransfusionSchema);
