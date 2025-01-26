import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { YesNoModalComponent } from './shared/components/yes-no-modal/yes-no-modal.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { MainComponent } from './pages/home/components/main/main.component';
import { ProfileComponent } from './pages/home/components/main/components/profile/profile.component';
import { FeedComponent } from './pages/home/components/main/components/feed/feed.component';
import { UserPostsComponent } from './pages/home/components/main/components/profile/components/user-posts/user-posts.component';
import { UserInformationComponent } from './pages/home/components/main/components/profile/components/user-information/user-information.component';
import { UserFriendsComponent } from './pages/home/components/main/components/profile/components/user-friends/user-friends.component';
import { UserPhotosComponent } from './pages/home/components/main/components/profile/components/user-photos/user-photos.component';
import { SearchComponent } from './pages/home/components/main/components/pages/search/search.component';
import { ChangeProfileModalComponent } from './shared/components/change-profile-modal/change-profile-modal.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'feed',
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'feed', component: FeedComponent, children: [
        { path: ':postId', component: UserPostsComponent },
      ] },
      {
        path: 'profile/:username',
        component: ProfileComponent,
        children: [
          { path: 'posts', component: UserPostsComponent },
          { path: 'information', component: UserInformationComponent },
          { path: 'friends', component: UserFriendsComponent },
          { path: 'photos', component: UserPhotosComponent },
        ],
      },
      { path: 'search', component: SearchComponent },
    ],
  },
  {
    path: 'post/:id',
    component: YesNoModalComponent,
  },
  {
    path: 'modal',
    component: YesNoModalComponent,
  },
  {
    path: 'mod',
    component: ChangeProfileModalComponent,
  },
];
