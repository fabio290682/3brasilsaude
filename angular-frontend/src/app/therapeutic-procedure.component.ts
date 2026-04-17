import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-therapeutic-procedure',
  templateUrl: './therapeutic-procedure.component.html',
  styleUrls: ['./therapeutic-procedure.component.css']
})
export class TherapeuticProcedureComponent {
  form = this.fb.group({
    request: ['54', Validators.required],
    type: ['01 - SANGRIA TERAPÊUTICA', Validators.required],
    patient: ['6597038 - TESTE PROCEDIMENTO', Validators.required],
    hospitalReg: ['6597038'],
    doctor: ['2.160.916 - ADALBERTO M. COELHO'],
    vitalsStart: this.fb.group({
      height: [1.8],
      weight: [90],
      bmi: [27],
      bloodPressure: ['120/080'],
      pulse: [90],
      temp: [36.0],
      hemoglobin: [15.0],
      hematocrit: [43.0],
    }),
    vitalsEnd: this.fb.group({
      height: [1.8],
      weight: [90],
      bmi: [27],
      bloodPressure: ['110/070'],
      pulse: [88],
      temp: [35.3],
      hemoglobin: [15.0],
      hematocrit: [43.0],
    }),
    procedure: this.fb.group({
      responsible: ['1 - SUPORTE E DESENVOLVIMENTO', Validators.required],
      startTime: ['09/09/2022 09:55'],
      endTime: ['09/09/2022 10:05'],
      componentRemoved: ['E001 - SANGUE TOTAL'],
      bagsRemoved: [1],
      volumeRemoved: [450],
      replacementFluid1: ['02 - Soro Fisiologico com Albumina'],
      replacementFluid1Qty: [100],
      replacementFluid2: ['04 - Outros'],
      replacementFluid2Qty: [130],
      destination: ['01 - Descarte', Validators.required],
      apheresisEquipment: ['05 - COBE SPECTRA'],
      evolution: ['']
    })
  });

  statusMessage = '';

  constructor(private fb: FormBuilder) {}

  submit() {
    if (this.form.invalid) {
      this.statusMessage = 'Complete os campos obrigatórios para finalizar.';
      this.form.markAllAsTouched();
      return;
    }

    this.statusMessage = 'Procedimento terapêutico gravado localmente.';
  }

  fieldError(path: string) {
    const control = this.form.get(path);
    return control?.invalid && control?.touched;
  }
}
