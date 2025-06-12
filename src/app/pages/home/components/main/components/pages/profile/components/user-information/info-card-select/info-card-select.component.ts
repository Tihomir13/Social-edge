import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, input, output, ViewChild } from '@angular/core';
import { ProfileStateService } from '../../../services/profile-state.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserInfoFormService } from '../../../../profile/components/user-information/info-card/user-info-form.service';

@Component({
  selector: 'app-info-card-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './info-card-select.component.html',
  styleUrl: './info-card-select.component.scss'
})
export class InfoCardSelectComponent {
  userInfo = input<string>();
  options = input<string[]>();
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
    console.log(this.options());
    
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
