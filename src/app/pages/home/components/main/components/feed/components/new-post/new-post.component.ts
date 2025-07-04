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

import { Subscription } from 'rxjs';

import { UtilityService } from '../../../../../../../../shared/services/utility/array-utility.service';
import { StatusPickerComponent } from './status-picker/status-picker.component';
import { statuses } from '../../../../../../../../shared/constants/arrays';
import { maxImageSize, validImageFileTypes } from '../../../../../../../../shared/constants/settings';
import { NewPostStateService } from './services/new-post-state.service';
import { NewPostRequestsService } from './services/new-post-requests.service';
import { NewPostFormServiceService } from '../../../../../../shared/services/new-post-form-service.service';
import { MainStateService } from '../../../../shared/services/main-state.service';
import { CustomModalComponent } from '../../../../../../../../shared/components/custom-modal/custom-modal.component';
import {
  LoadingSpinnerComponent,
  size,
} from '../../../../../../../../shared/components/loading-spinner/loading-spinner.component';

import { PostModel } from '../post/model/post.model';
import { ToxicityService } from '../../../../../../shared/services/AI/toxicity.service';
import { NsfwService } from '../../../../../../shared/services/AI/nsfw.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    StatusPickerComponent,
    ReactiveFormsModule,
    NgClass,
    NgStyle,
    CustomModalComponent,
    LoadingSpinnerComponent,
  ],
  providers: [UtilityService, NewPostRequestsService],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent implements OnDestroy {
  get tags(): FormArray {
    return this.newPostFormService.newPostFormGroup()?.get('tags') as FormArray;
  }

  loadingSize = size;

  isSubmitting: boolean = false;
  isImageLoading: boolean = false;

  get imagesFiles(): FormArray {
    return this.newPostFormService
      .newPostFormGroup()
      ?.get('images') as FormArray;
  }

  modalOptions = [
    {
      optionName: 'Delete',
      optionColor: 'red',
    },
    {
      optionName: 'Cancel',
      optionColor: 'white',
    },
  ];
  isDeletionModalOpened: boolean = false;

  newPostFormService = inject(NewPostFormServiceService);
  toxicityService = inject(ToxicityService);
  private nsfwService = inject(NsfwService);

  subscriptions = new Subscription();

  @ViewChild('textArea', { static: false }) textArea!: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile!: ElementRef;

  arrUtilService = inject(UtilityService);
  private renderer = inject(Renderer2);
  private elRef = inject(ElementRef);
  mainState = inject(MainStateService);
  private cdr = inject(ChangeDetectorRef);
  private formBuilder = inject(FormBuilder);
  newPostState = inject(NewPostStateService);
  private newPostRequests = inject(NewPostRequestsService);

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

      // TODO Might change
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

      this.isImageLoading = true;
      const nsfwCheck = await this.nsfwService.checkNsfw(file);
      this.isImageLoading = false;

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
    const validFileTypes = validImageFileTypes
    return validFileTypes.includes(file.type);
  }

  isValidFileSize(file: File): boolean {
    const maxFileSize = maxImageSize * 1024 * 1024;
    return file.size <= maxFileSize;
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
            !isTitleEmpty &&
            !isTextEmpty &&
            !isStatusEmpty &&
            isTagsEmpty.length === 0 &&
            isImagesEmpty.length === 0
          ) {
            this.newPostState.toggleNewPost();
            this.newPostState.removeGlobalClickListener();
            return;
          } else {
            this.isDeletionModalOpened = true;
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

  isFormEmpty(): boolean {
    if (this.newPostFormService.newPostFormGroup()?.value.images.length === 0
      && this.newPostFormService.newPostFormGroup()?.value.tags.length === 0
      && this.newPostFormService.newPostFormGroup()?.value.status === null
      && this.newPostFormService.newPostFormGroup()?.value.text === null
      && this.newPostFormService.newPostFormGroup()?.value.title === null) {
      return true;
    }
    else {
      return false;
    }
  }

  async onSubmit(): Promise<void> {
    if (
      !this.newPostFormService.newPostFormGroup()?.valid ||
      this.isSubmitting
    ) {
      return;
    }

    if (this.isFormEmpty()) {
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      if (this.isSubmitting) {
        this.isSubmitting = false;
      }
    }, 30000);

    if (this.newPostFormService.newPostFormGroup().get('title')?.value !== null) {
      const isTitleToxic = await this.toxicityService.checkToxicText(
        this.newPostFormService.newPostFormGroup().get('title')!.value
      );

      if (isTitleToxic) {
        this.resetPost();
        return;
      }
    }


    if (this.newPostFormService.newPostFormGroup().get('text')?.value !== null) {
      const isTextToxic = await this.toxicityService.checkToxicText(
        this.newPostFormService.newPostFormGroup().get('text')!.value
      );

      if (isTextToxic) {
        this.resetPost();
        return;
      }
    }

    for (const tag of this.tags.controls) {
      const isTagToxic = await this.toxicityService.checkToxicText(tag.value);

      if (isTagToxic) {
        this.resetPost();
        return;
      }
    }

    const formData = this.newPostFormService.newPostFormGroup()?.value;

    this.subscriptions.add(
      this.newPostRequests.savePost(formData).subscribe({
        next: (response: { messages?: string; fetchedNewPost?: PostModel }) => {
          this.clearFormArrays();
          this.newPostFormService.newPostFormGroup()?.reset();
          this.newPostState.isCreatingNewPost = false;

          this.mainState.addNewPostToFeed(response.fetchedNewPost);
        },
        error: (error) => {
          console.error('Error saving post', error);
        },
        complete: () => {
          this.resetPost();
        },
      })
    );
  }

  onChoseOptionProfile(modalOption: string): void {
    if (modalOption === 'Delete') {
      this.resetPost();
    }

    this.isDeletionModalOpened = false;
  }

  resetPost() {
    const tagsArray = this.newPostFormService
      .newPostFormGroup()
      .get('tags') as FormArray;
    tagsArray.clear();

    const imagesArray = this.newPostFormService
      .newPostFormGroup()
      ?.get('images') as FormArray;
    imagesArray.clear();
    this.newPostState.imagePreviews = [];
    this.newPostState.currentStatus = '';

    this.newPostFormService.newPostFormGroup().reset();
    this.newPostState.toggleNewPost(false);
    this.newPostState.removeGlobalClickListener();
    this.newPostState.resetUI();
    this.isSubmitting = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
