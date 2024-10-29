import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class AuthModule { }
