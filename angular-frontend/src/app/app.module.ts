import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CollectionMaintenanceComponent } from './collection-maintenance.component';
import { TransfusionRequestComponent } from './transfusion-request.component';
import { TherapeuticProcedureComponent } from './therapeutic-procedure.component';

@NgModule({
  declarations: [
    AppComponent,
    CollectionMaintenanceComponent,
    TransfusionRequestComponent,
    TherapeuticProcedureComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'collection', pathMatch: 'full' },
      { path: 'collection', component: CollectionMaintenanceComponent },
      { path: 'transfusion', component: TransfusionRequestComponent },
      { path: 'therapeutic', component: TherapeuticProcedureComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
