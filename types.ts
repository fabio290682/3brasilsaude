export type BloodGroup = 'A' | 'B' | 'AB' | 'O';
export type RhFactor   = '+' | '-';
export type CollectionStatus  = 'available'|'reserved'|'used'|'discarded'|'expired';
export type TransfusionStatus = 'pending'|'approved'|'in_progress'|'completed'|'cancelled';
export type TherapeuticStatus = 'scheduled'|'in_progress'|'completed'|'cancelled';
export type TherapeuticType   = 'plasmapheresis'|'plateletpheresis'|'erythrocytapheresis'|'leukapheresis'|'photopheresis'|'other';
export interface Collection { _id:string;donorName:string;donorBirthDate:string;donorDocument:string;bloodGroup:BloodGroup;rhFactor:RhFactor;phenotyping?:string;collectionDate:string;volumeMl:number;bagCode:string;phlebotomist:string;hospitalReg?:string;triageApproved:boolean;triageNotes?:string;status:CollectionStatus;expiresAt:string;createdAt:string;updatedAt:string; }
export interface Transfusion { _id:string;patientName:string;patientBirthDate:string;patientDocument:string;hospitalOrder:string;ward?:string;bloodGroup:BloodGroup;rhFactor:RhFactor;bloodType?:string;quantityMl:number;collectionRef?:string;bagCode?:string;indication:string;requestingDoctor:string;requestDate:string;status:TransfusionStatus;approvedBy?:string;approvedAt?:string;completedAt?:string;notes?:string;createdAt:string;updatedAt:string; }
export interface Therapeutic { _id:string;patientName:string;patientBirthDate:string;patientDocument:string;hospitalReg?:string;procedureType:TherapeuticType;procedureDate:string;durationMin?:number;indication:string;responsibleDoctor:string;operator?:string;volumeProcessedMl?:number;replacementFluid?:string;anticoagulant?:string;vascularAccess?:string;status:TherapeuticStatus;outcome?:string;adverse?:string;completedAt?:string;notes?:string;createdAt:string;updatedAt:string; }
export interface PaginatedResponse<T> { data:T[];total:number;page:number;limit:number; }
export type Page = 'dashboard'|'collections'|'transfusions'|'therapeutic';
