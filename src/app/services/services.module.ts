import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GameService } from './game.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    GameService
  ]
})
export class ServicesModule { }