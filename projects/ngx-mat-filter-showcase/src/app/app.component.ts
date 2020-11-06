import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  links: { name: string; url: string }[] = [
    {
      name: 'Basic',
      url: '/basic'
    }, {
      name: 'Inline',
      url: '/inline'
    }, {
      name: 'Advance',
      url: '/advance'
    }
  ];
}
