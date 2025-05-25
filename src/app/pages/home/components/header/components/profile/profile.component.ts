import {
  ApplicationRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { UtilitySessionService } from '../../../../../../shared/services/utility/utility.service';
import { MainStateService } from '../../../main/shared/services/main-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  isArrowRotated = false;
  isImageClickable = false;
  username = '';

  // logout = output();
  // options = output();

  @ViewChild('profileMenu') profileMenu!: ElementRef;
  @ViewChild('arrowImg') arrowImg!: ElementRef;

  private unlisten!: () => void;

  router = inject(Router);
  mainState = inject(MainStateService);
  utilitySession = inject(UtilitySessionService);
  renderer = inject(Renderer2);
  el = inject(ElementRef);

  ngOnInit(): void {
    this.checkWindowWidth();

    const userInfo = this.utilitySession.userInfo;
    this.username = userInfo.username;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth();
  }

  checkWindowWidth(): void {
    const width = window.innerWidth;
    this.isImageClickable = width <= 768;
  }

  toggleArrow(): void {
    this.isArrowRotated = !this.isArrowRotated;

    if (this.isArrowRotated) {
      this.renderer.addClass(this.profileMenu.nativeElement, 'open');
      this.renderer.addClass(this.arrowImg.nativeElement, 'rotated');
      this.listenClickOutsideOfMenu();
    } else {
      this.renderer.removeClass(this.profileMenu.nativeElement, 'open');
      this.renderer.removeClass(this.arrowImg.nativeElement, 'rotated');
    }
  }

  navToProfilePage(): void {
    this.router.navigate(['profile', this.username, 'posts']);
  }

  listenClickOutsideOfMenu(): void {
    this.unlisten = this.renderer.listen(
      'document',
      'click',
      (event: Event) => {
        const target = event.target as HTMLElement;
        const profileContainer = this.el.nativeElement;

        if (!profileContainer.contains(target)) {
          this.isArrowRotated = false;
          this.renderer.removeClass(this.profileMenu.nativeElement, 'open');
          this.renderer.removeClass(this.arrowImg.nativeElement, 'rotated');

          if (this.unlisten) {
            this.unlisten();
          }
        }
      }
    );
  }

  onImageClick(): void {
    if (this.isImageClickable) {
      this.navToProfilePage();
    }
  }

  logout(): void {
    this.utilitySession.resetSession();
    window.location.reload();
    // this.router.navigate(['/login']);
  }

  options(): void {
    this.renderer.removeClass(this.profileMenu.nativeElement, 'open');
    this.renderer.removeClass(this.arrowImg.nativeElement, 'rotated');
    this.router.navigate(['/settings']);
    // this.utilitySession.resetSession();
  }

  onDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }
  }
}
