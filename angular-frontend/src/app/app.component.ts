import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navigation = [
    { path: 'collection', label: 'Manutenção de Coleta' },
    { path: 'transfusion', label: 'Requisição de Transfusão' },
    { path: 'therapeutic', label: 'Procedimento Terapêutico' }
  ];
}
