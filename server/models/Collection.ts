import mongoose from 'mongoose';

const DonorSchema = new mongoose.Schema(
  {
    photo: String,
    name: { type: String, required: true },
    id: { type: String, required: true },
    birthDate: String,
    age: Number,
    sex: String,
    donorClass: String,
    motherName: String,
    fatherName: String,
    bloodGroup: String,
    rhFactor: String,
    pai: String,
    iai: String,
    phenotyping: String,
    ehResult: String,
    hbsResult: String,
  },
  { _id: false }
);

const CollectionSchema = new mongoose.Schema(
  {
    triagem: { type: String, required: true },
    coleta: { type: String, required: true },
    date: { type: String, required: true },
    option: { type: String, required: true },
    type: { type: String, required: true },
    donor: { type: DonorSchema, required: true },
    start: {
      phlebotomist: { type: String, required: true },
      targetQty: { type: String, required: true },
      bagType: { type: String, required: true },
    },
    end: {
      phlebotomist: { type: String, required: true },
      actualQty: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      punctureSite: { type: String, required: true },
      homogenizer: { type: String, required: true },
    },
    observations: {
      collection: String,
      forCollection: String,
      fractionation: String,
    },
    supplies: {
      alcoholLot: { type: String, required: true },
      degermantLot: { type: String, required: true },
    },
  },
  { timestamps: true }
);

CollectionSchema.index({ date: 1 });
CollectionSchema.index({ createdAt: -1 });

export const CollectionModel = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
