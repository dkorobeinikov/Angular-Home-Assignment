import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav-bar></nav-bar>
    <h1>
        Home Assignment
    </h1>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'app';
}
