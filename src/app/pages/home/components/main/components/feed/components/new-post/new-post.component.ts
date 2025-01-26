import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Subscription } from 'rxjs';

import * as nsfwjs from 'nsfwjs';
import { UtilityService } from '../../../../../../../../shared/services/utility/array-utility.service';
import { StatusPickerComponent } from './status-picker/status-picker.component';
import { statuses } from '../../../../../../../../shared/constants/arrays';
import { maxImageSize } from '../../../../../../../../shared/constants/settings';
import { ModalService } from '../../../../../../shared/services/modal.service';
import { NewPostStateService } from './services/new-post-state.service';
import { NewPostRequestsService } from './services/new-post-requests.service';
import { NewPostFormServiceService } from '../../../../../../shared/services/new-post-form-service.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    StatusPickerComponent,
    ReactiveFormsModule,
    NgClass,
    NgStyle,
    HttpClientModule,
  ],
  providers: [UtilityService, NewPostRequestsService],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent implements OnDestroy {
  get tags(): FormArray {
    return this.newPostFormService.newPostFormGroup()?.get('tags') as FormArray;
  }

  get imagesFiles(): FormArray {
    return this.newPostFormService
      .newPostFormGroup()
      ?.get('images') as FormArray;
  }

  newPostFormService = inject(NewPostFormServiceService);

  subscriptions = new Subscription();

  @ViewChild('textArea', { static: false }) textArea!: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile!: ElementRef;

  arrUtilService = inject(UtilityService);
  private renderer = inject(Renderer2);
  private elRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(ModalService);
  private formBuilder = inject(FormBuilder);
  newPostState = inject(NewPostStateService);
  private newPostRequests = inject(NewPostRequestsService);

  creatingNewPost = output();

  onAddTag(tag: string): void {
    if (tag === '') {
      return;
    }

    if (!tag.startsWith('#')) {
      tag = '#' + tag;
    }

    if (this.tags.value.includes(tag)) {
      this.newPostState.errorMsgTag = `You have already entered ${tag}.`;
      return;
    }

    if (this.newPostState.errorMsgTag != '') {
      this.newPostState.errorMsgTag = '';
    }

    this.tags.push(this.formBuilder.control(tag));
  }

  onRemoveTag(index: number): void {
    this.tags.removeAt(index);
  }

  async onAddFile(event: any): Promise<void> {
    const files = Array.from(event.target.files) as File[];

    for (const file of files) {
      const isDuplicate = this.isDuplicateFile(file);
      if (isDuplicate) {
        this.newPostState.errorMsgPhoto = 'This file has already been added.';
        continue;
      }

      const isValidType = this.isValidFileType(file);
      if (!isValidType) {
        this.newPostState.errorMsgPhoto =
          'Please, upload only PNG or JPEG images.';
        continue;
      }

      const isValidSize = this.isValidFileSize(file);
      if (!isValidSize) {
        this.newPostState.errorMsgPhoto = `The image needs to be smaller than ${maxImageSize}MB.`;
        continue;
      }

      const nsfwCheck = await this.checkNsfw(file);
      if (!nsfwCheck) {
        this.newPostState.errorMsgPhoto =
          'NSFW content detected. Please, upload appropriate images.';
        continue;
      }

      if (this.newPostState.errorMsgPhoto !== '') {
        this.newPostState.errorMsgPhoto = '';
      }

      // Добавяме файла и генерираме визуализация
      this.imagesFiles.push(this.formBuilder.control(file));
      const previewUrl = await this.getPreviewUrl(file);
      if (!this.newPostState.imagePreviews.includes(previewUrl)) {
        this.newPostState.imagePreviews.push(previewUrl);
      }
    }

    (event.target as HTMLInputElement).value = '';
  }

  isDuplicateFile(file: File): boolean {
    return this.imagesFiles.value.some(
      (selectedFile: File) =>
        selectedFile.name === file.name &&
        selectedFile.size === file.size &&
        selectedFile.lastModified === file.lastModified
    );
  }

  isValidFileType(file: File): boolean {
    const validFileTypes = ['image/png', 'image/jpeg'];
    return validFileTypes.includes(file.type);
  }

  isValidFileSize(file: File): boolean {
    const maxFileSize = maxImageSize * 1024 * 1024;
    return file.size <= maxFileSize;
  }

  async checkNsfw(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = async () => {
          const model = await nsfwjs.load('InceptionV3');
          const predictions = await model.classify(image);
          const nsfwResult = predictions.find(
            (p) => p.className === 'Porn' || p.className === 'Hentai'
          );
          resolve(!(nsfwResult && nsfwResult.probability > 0.3));
        };
      };
      reader.readAsDataURL(file);
    });
  }

  async getPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  onRemoveFile(index: number): void {
    this.newPostState.imagePreviews = this.arrUtilService.removeElemById(
      this.newPostState.imagePreviews,
      index
    );

    this.imagesFiles.removeAt(index);
  }

  toggleStatusPicker(): void {
    this.newPostState.isStatusPickerVisible =
      !this.newPostState.isStatusPickerVisible;
  }

  onStatusPickerClose(isVisible: boolean): void {
    this.newPostState.isStatusPickerVisible = isVisible;
  }

  onStatusChange(index: number): void {
    const newStatus = statuses[index];
    this.newPostState.currentStatus = newStatus.emoji;
    this.newPostFormService
      .newPostFormGroup()
      .patchValue({ status: newStatus });
    this.startCreatingNewPost();
  }

  triggerFileInput(): void {
    this.newPostState.toggleNewPost(true);
    this.cdr.detectChanges();
    this.inputFile.nativeElement.click();
  }

  startCreatingNewPost(): void {
    if (!this.newPostState.isCreatingNewPost) {
      this.newPostState.toggleNewPost(true);

      this.focusTextArea();

      const listener = this.renderer.listen(
        'document',
        'click',
        (event: Event) => {
          if (this.elRef.nativeElement.contains(event.target)) {
            return;
          }

          const isTitleEmpty =
            this.newPostFormService.newPostFormGroup().value.title;
          const isTextEmpty =
            this.newPostFormService.newPostFormGroup().value.text;
          const isTagsEmpty =
            this.newPostFormService.newPostFormGroup().value.tags;
          const isImagesEmpty =
            this.newPostFormService.newPostFormGroup().value.images;
          const isStatusEmpty =
            this.newPostFormService.newPostFormGroup().value.status;

          if (
            isTitleEmpty === null &&
            isTextEmpty === null &&
            isTagsEmpty.length === 0 &&
            isImagesEmpty.length === 0 &&
            isStatusEmpty === null
          ) {
            this.newPostState.toggleNewPost();
            this.newPostState.removeGlobalClickListener();
            return;
          } else {
            this.modalService.isModalToggled.set(true);
          }
        }
      );
      this.newPostState.setGlobalClickListener(listener);
    }
  }

  focusTextArea(): void {
    this.cdr.detectChanges();

    if (this.textArea) {
      this.renderer.selectRootElement(this.textArea.nativeElement).focus();
    }
  }

  clearFormArrays(): void {
    if (this.newPostFormService.newPostFormGroup()) {
      Object.keys(this.newPostFormService.newPostFormGroup()!.controls).forEach(
        (key) => {
          const control = this.newPostFormService.newPostFormGroup()!.get(key);

          if (control instanceof FormArray) {
            while (control.length !== 0) {
              control.removeAt(0);
            }
          }
        }
      );
    }
  }

  onSubmit(): void {
    if (this.newPostFormService.newPostFormGroup()?.valid) {
      const formData = this.newPostFormService.newPostFormGroup()?.value;

      console.log(formData);

      this.subscriptions.add(
        this.newPostRequests.savePost(formData).subscribe({
          next: (response) => {
            console.log('Post saved successfully', response);
            this.clearFormArrays();
            this.newPostFormService.newPostFormGroup()?.reset();
            this.newPostState.isCreatingNewPost = false;
            this.newPostState.resetUI();
            console.log(this.newPostFormService.newPostFormGroup()?.value);

            this.creatingNewPost.emit();
          },
          error: (error) => {
            console.error('Error saving post', error);
          },
        })
      );
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
