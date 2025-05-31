import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonTab} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ IonTab, IonTabs, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule
  ],
})
export class HomePage {
  
  constructor() {
    
  } 
}
