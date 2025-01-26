import {
  Component,
  ElementRef,
  inject,
  output,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  searchProfile = output<string>();
  subscriptions = new Subscription();

  router = inject(Router);

  @ViewChild('searchInput') searchBar!: ElementRef;

  clearSearchBarOnUrlChange(): void {
    this.searchBar.nativeElement.value = '';
  }

  subscribeToUrl():void {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.clearSearchBarOnUrlChange();
        })
    );
  }

  onSearch(event: KeyboardEvent, value: string): void {
    if (event.key === 'Enter') {
      this.searchProfile.emit(value);
      this.subscribeToUrl();
    }
  }
}
