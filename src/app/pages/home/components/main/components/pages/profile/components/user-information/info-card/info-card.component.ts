import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ProfileStateService } from '../../../services/profile-state.service';
import { UserInfoFormService } from './user-info-form.service';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
})
export class InfoCardComponent implements OnInit {
  userInfo = input<string | null | []>();
  alt = input<string>();
  imgSrc = input<string>();
  isUserAdding = false;
  state = inject(ProfileStateService);
  userInfoFormGroup!: FormGroup;
  generateUserInfoGroup = inject(UserInfoFormService);

  newInfo = output();

  @ViewChild('input', { static: false }) input!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.isUserAdding && !target.closest('.form')) {
      this.onCancel();
    }
  }

  ngOnInit(): void {
    this.userInfoFormGroup = this.generateUserInfoGroup.generateUserInfoForm();
  }

  onAdd(): void {
    this.isUserAdding = true;

    this.input?.nativeElement.focus();
  }

  onCancel(): void {
    this.isUserAdding = false;
  }

  onEdit(): void {
    this.isUserAdding = true;

    this.userInfoFormGroup.get('info')?.setValue(this.userInfo());
  }

  onDelete(): void {
    const body: any = {
      value: '',
      infoType: this.alt(),
    };

    this.isUserAdding = false;
    this.newInfo.emit(body);
  }

  onSave(): void {
    if (this.userInfoFormGroup.valid) {
      const value = this.userInfoFormGroup.get('info')?.value;

      const body: any = {
        value: value,
        infoType: this.alt(),
      };

      this.isUserAdding = false;
      this.newInfo.emit(body);
    }
  }
}
