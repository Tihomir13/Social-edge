import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProfileComponent } from './pages/home/components/main/components/pages/profile/profile.component';
import { FeedComponent } from './pages/home/components/main/components/feed/feed.component';
import { UserPostsComponent } from './pages/home/components/main/components/pages/profile/components/user-posts/user-posts.component';
import { UserInformationComponent } from './pages/home/components/main/components/pages/profile/components/user-information/user-information.component';
import { UserFriendsComponent } from './pages/home/components/main/components/pages/profile/components/user-friends/user-friends.component';
import { UserPhotosComponent } from './pages/home/components/main/components/pages/profile/components/user-photos/user-photos.component';
import { SearchComponent } from './pages/home/components/main/components/pages/search/search.component';
import { CustomModalComponent } from './shared/components/custom-modal/custom-modal.component';
import { ForgottenPasswordComponent } from './pages/forgotten-password/forgotten-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PostModalComponent } from './pages/home/components/main/components/feed/components/post-modal/post-modal.component';
import { FriendListComponent } from './pages/home/components/main/components/friend-list/friend-list.component';
import { mobileGuard } from './shared/guards/mobile.guard';
import { PeopleComponent } from './pages/home/components/main/components/pages/people/people.component';
import { BlankComponent } from './pages/blank/blank.component';
import { ProfileSettingsComponent } from './pages/home/components/main/components/pages/profile-settings/profile-settings.component';

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
    path: 'forgotten-password',
    component: ForgottenPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'feed',
        component: FeedComponent,
        // children: [{ path: ':postId', component: UserPostsComponent }],
      },
      {
        path: 'posts/:id',
        component: BlankComponent,
        // children: [{ path: ':id', component: PostModalComponent }],
      },
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
      { path: 'people', component: PeopleComponent },
      { path: 'search', component: SearchComponent },
      { path: 'profile-settings', component: ProfileSettingsComponent },
      {
        path: 'friends',
        component: FriendListComponent,
        canActivate: [mobileGuard],
      },
    ],
  },
];
