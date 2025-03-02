import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { imagePostModel } from '../post/model/post.model';
import { FormGroup } from '@angular/forms';
import { MainStateService } from '../../../../shared/services/main-state.service';

@Component({
  selector: 'app-post-modal',
  imports: [],
  templateUrl: './post-modal.component.html',
  styleUrl: './post-modal.component.scss',
})
export class PostModalComponent {
  postId = input<string>('');
  username = input<string>('');
  authorProfileImg = input<any>();
  title = input<string>('');
  text = input<string>('');
  tags = input<string[]>([]);
  likes = input<string[]>([]);
  images = input<any[]>([]);
  comments = input<any[]>([]);
  totalCommentsCount = input<number>(0);
  currUserImg = input();
  totalLikes$ = input<number>();
  isLikedByCurrUser$ = input<boolean>();
  createdAt = input();
  isLiked: boolean | undefined;
  totalLikes: number | undefined;

  closeModal = output();

  private unlisten!: () => void;

  private renderer = inject(Renderer2);
  mainState = inject(MainStateService);

  @ViewChild('comment') comment!: ElementRef<HTMLTextAreaElement>;
  currentImageIndex = 0;

  ngOnInit(): void {}

  commentFormGroup!: FormGroup;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.post-modal-container')) {
      this.mainState.setOpenedPost(null);
    }
  }

  nextImage(): void {
    if (this.currentImageIndex < this.images().length - 1) {
      this.currentImageIndex++;
    }

    console.log(this.images()[this.currentImageIndex]);
    console.log(this.currentImageIndex);
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }
  }
}
