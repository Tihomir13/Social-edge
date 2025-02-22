import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  searchedText = output<string>();

  onSearchStatus(value: string) {
    this.searchedText.emit(value);
  }
}
