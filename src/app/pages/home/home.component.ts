import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgClass } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { ModalService } from './shared/services/modal.service';
import { NewPostStateService } from './components/main/components/feed/components/new-post/services/new-post-state.service';
import { JwtInterceptor } from '../../shared/interceptors/jwt.interceptor';
import { GenerateNewPostForm } from './components/main/components/feed/components/new-post/helpers/form-factory/new-post-form';
import { NewPostFormServiceService } from './shared/services/new-post-form-service.service';
import { JwtSenderService } from './shared/services/jwt-sender.service';
import { UtilitySessionService } from '../../shared/services/utility/utility.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    MainComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    JwtSenderService,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();

  getJwtInterval = 3000000;

  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  newPostStateService = inject(NewPostStateService);
  newPostFormService = inject(NewPostFormServiceService);
  utilitySessionService = inject(UtilitySessionService);
  jwtSendService = inject(JwtSenderService);

  ngOnInit(): void {
    const formGenerator = new GenerateNewPostForm(this.formBuilder);
    const newPostFormGroup = formGenerator.generateNewPostForm();

    this.newPostFormService.setFormGroup(newPostFormGroup);

    this.getNewJwt();
  }

  getNewJwt():void {
    const timer = setInterval(() => {
      this.subscriptions.add(
        this.jwtSendService.getNewJwt().subscribe({
          next: (response) => {
            this.utilitySessionService.setToken(response.token);
          },
          error: (error) => {
            console.log(error);
          },
        })
      );
    }, this.getJwtInterval);
  }

  // Ако искаш да спреш интервала
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
