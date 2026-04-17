export type View = 'customers' | 'opportunities' | 'orders';

export interface CustomerData {
  photo?: string;
  name: string;
  id: string; // Pessoa Física
  birthDate: string;
  age: number;
  sex: 'Masculino' | 'Feminino' | 'Outro';
  donorClass: string;
  motherName: string;
  fatherName: string;
  bloodGroup: 'A' | 'B' | 'AB' | 'O';
  rhFactor: '+' | '-';
  pai: string;
  iai: string;
  phenotyping: string;
  ehResult: string;
  hbsResult: string;
}

export interface CustomerProfileData {
  triagem: string;
  coleta: string;
  date: string;
  option: string;
  type: string;
  mode: string;
  donor: CustomerData;
  start: {
    phlebotomist: string;
    targetQty: number;
    bagType: string;
  };
  end: {
    phlebotomist: string;
    actualQty: number;
    startTime: string;
    endTime: string;
    punctureSite: string;
    homogenizer: string;
  };
  observations: {
    collection: string;
    forCollection: string;
    fractionation: string;
  };
  supplies: {
    alcoholLot: string;
    degermantLot: string;
  };
}

export interface OpportunityData {
  id: string;
  dateTime: string;
  patientStatus: string;
  priority: 'Urgência' | 'Rotina' | 'Extrema Urgência';
  status: string;
  patient: {
    name: string;
    id: string;
    hospitalReg: string;
    serviceCode: string;
    hospitalLocation: string;
    transfusionClinic: string;
    auth: string;
    bloodType: string;
    admissionDateTime: string;
    agreement: string;
    room: string;
    guide: string;
    newborn: boolean;
    sequential: string;
    hospital: string;
    inpatientClinic: string;
    bed: string;
  };
  details: {
    characteristics: string;
    phenotyping: string;
    antibodies: string;
    observations: string;
    reservedBags: string;
  };
}

export interface OrderData {
  request: string;
  type: string;
  patient: string;
  hospitalReg: string;
  doctor: string;
  clinic: string;
  hospitalOrder: string;
  vitalsStart: Vitals;
  vitalsEnd: Vitals;
  procedure: {
    responsible: string;
    startTime: string;
    endTime: string;
    componentRemoved: string;
    bagsRemoved: number;
    volumeRemoved: number;
    replacementFluid1: string;
    replacementFluid1Qty: number;
    replacementFluid2?: string;
    replacementFluid2Qty?: number;
    destination: string;
    apheresisEquipment: string;
    evolution: string;
  };
}

export interface Vitals {
  value: number;
  weight: number;
  bmi: number;
  bloodPressure: string;
  pulse: number;
  temp: number;
  hemoglobin: number;
  hematocrit: number;
}
