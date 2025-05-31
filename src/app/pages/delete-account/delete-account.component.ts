import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DeleteAccountRequestService } from './services/delete-account-request.service';

@Component({
  selector: 'app-delete-account',
  imports: [RouterLink],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss',
})
export class DeleteAccountComponent {
  isSuccessful = false;

  deleteAccountRequest = inject(DeleteAccountRequestService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.deleteAccountRequest.verifyLink(token).subscribe({
        next: (response) => {
          this.isSuccessful = true;
        },
        error: () => {
          this.router.navigate(['/login']);
        },
      });
    }
  }
}
