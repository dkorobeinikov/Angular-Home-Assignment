import { Component } from "@angular/core";

@Component({
    selector: "nav-bar",
    templateUrl: "./nav-bar.component.html",
    styles: [
        `
            .nav {
                background-color: #6c7ae0;
                min-height: 48px;
                padding: 16px 16px;
                position: sticky;
                top: 0;
                box-shadow: 2px 0 10px -2px #666;
            }

            .logo {
                font-size: 24px;
                line-height: 32px;
                color: white;
                text-decoration: none;
            }
        `,
    ],
})
export class NavBarComponent {


}
