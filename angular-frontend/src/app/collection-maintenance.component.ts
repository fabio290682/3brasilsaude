import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-collection-maintenance',
  templateUrl: './collection-maintenance.component.html',
  styleUrls: ['./collection-maintenance.component.css']
})
export class CollectionMaintenanceComponent {
  initialForm = {
    triagem: '3.842',
    coleta: 'B345922000108',
    date: '15/09/2022',
    option: '3 - Coleta de Bolsa e Amostras',
    type: '01 - Coleta de Amostra + Bolsa',
    start: {
      phlebotomist: '366.667 PROFISSIONAL SBS',
      targetQty: '1',
      bagType: 'T'
    },
    end: {
      phlebotomist: '366.667 PROFISSIONAL SBS',
      actualQty: '1',
      startTime: '08:00',
      endTime: '08:15',
      punctureSite: 'D - Direito',
      homogenizer: '201 - COMPOGUARD COMPLETE 004CG00707'
    },
    observations: {
      collection: '',
      forCollection: '',
      fractionation: ''
    },
    supplies: {
      alcoholLot: 'LOT12345',
      degermantLot: 'LOT67890'
    }
  };

  form = this.fb.group({
    triagem: [this.initialForm.triagem, Validators.required],
    coleta: [this.initialForm.coleta, Validators.required],
    date: [this.initialForm.date, Validators.required],
    option: [this.initialForm.option, Validators.required],
    type: [this.initialForm.type, Validators.required],
    start: this.fb.group({
      phlebotomist: [this.initialForm.start.phlebotomist, Validators.required],
      targetQty: [this.initialForm.start.targetQty, Validators.required],
      bagType: [this.initialForm.start.bagType, Validators.required]
    }),
    end: this.fb.group({
      phlebotomist: [this.initialForm.end.phlebotomist, Validators.required],
      actualQty: [this.initialForm.end.actualQty, Validators.required],
      startTime: [this.initialForm.end.startTime, Validators.required],
      endTime: [this.initialForm.end.endTime, Validators.required],
      punctureSite: [this.initialForm.end.punctureSite, Validators.required],
      homogenizer: [this.initialForm.end.homogenizer, Validators.required]
    }),
    observations: this.fb.group({
      collection: [this.initialForm.observations.collection],
      forCollection: [this.initialForm.observations.forCollection],
      fractionation: [this.initialForm.observations.fractionation]
    }),
    supplies: this.fb.group({
      alcoholLot: [this.initialForm.supplies.alcoholLot, Validators.required],
      degermantLot: [this.initialForm.supplies.degermantLot, Validators.required]
    })
  });

  statusMessage = '';

  constructor(private fb: FormBuilder, private api: ApiService) {}

  submit() {
    if (this.form.invalid) {
      this.statusMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.form.markAllAsTouched();
      return;
    }

    this.api.saveCollection(this.form.value).subscribe({
      next: (result) => {
        this.statusMessage = `Coleta salva com sucesso. ID: ${result.id}`;
      },
      error: () => {
        this.statusMessage = 'Falha ao salvar a coleta. Verifique se o backend está disponível.';
      }
    });
  }

  resetForm() {
    this.form.reset(this.initialForm);
    this.statusMessage = 'Formulário restaurado.';
  }

  fieldError(path: string) {
    const control = this.form.get(path);
    return control?.invalid && control?.touched;
  }
}
