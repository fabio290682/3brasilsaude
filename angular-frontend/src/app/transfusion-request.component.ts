import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfusion-request',
  templateUrl: './transfusion-request.component.html',
  styleUrls: ['./transfusion-request.component.css']
})
export class TransfusionRequestComponent {
  form = this.fb.group({
    id: ['2200000005', Validators.required],
    dateTime: ['28/09/2022 08:00', Validators.required],
    patientStatus: ['01 - Internado', Validators.required],
    priority: ['03 - Urgência', Validators.required],
    status: ['Não Atendida', Validators.required],
    patient: this.fb.group({
      name: ['4.114.557 - JOAO DA SILVA', Validators.required],
      hospitalReg: ['1234', Validators.required],
      bloodType: ['O - Positivo', Validators.required],
      agreement: ['17 - SUS', Validators.required],
      room: ['04'],
    }),
    details: this.fb.group({
      characteristics: ['Paciente que necessita bolsa fenotipada'],
      phenotyping: ['c- C+ D+ e- E+ K+'],
      antibodies: ['A (Anti A), C (Anti C)'],
      observations: ['PACIENTE DE DIFÍCIL REDE VENOSA'],
      reservedBags: ['Pessoa física não possui reserva de bolsa']
    })
  });

  statusMessage = '';

  constructor(private fb: FormBuilder) {}

  submit() {
    if (this.form.invalid) {
      this.statusMessage = 'Verifique os campos obrigatórios.';
      this.form.markAllAsTouched();
      return;
    }

    this.statusMessage = 'Requisição de transfusão atualizada com sucesso.';
  }

  fieldError(path: string) {
    const control = this.form.get(path);
    return control?.invalid && control?.touched;
  }
}
