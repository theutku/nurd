import { Component } from '@angular/core';
import * as nurdData from './../assets/nurd.json';
import * as dummyData from './../assets/dummy.json';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    appTitle = 'NURD Assignment';

    sourceJson = dummyData.default;
    result: string;

    onRouteReached(route: string) {
        this.result = route;
    }
}
