import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UtilitySessionService } from '../../../../../../shared/services/utility/utility.service';

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

  email = '';
  username = '';

  router = inject(Router);
  utilitySession = inject(UtilitySessionService);

  ngOnInit(): void {
    this.checkWindowWidth();

    const userInfo = this.utilitySession.userInfo;

    this.email = userInfo.email;
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
  }

  navToProfilePage(): void {
    this.router.navigate(['profile', this.username, 'posts']);
  }

  onImageClick(): void {
    if (this.isImageClickable) {
      this.navToProfilePage()
    }
    
  }
}
