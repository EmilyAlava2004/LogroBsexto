import { Component, OnInit } from '@angular/core';
import { filmOutline, homeOutline, radioOutline, searchOutline, trendingUpOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonRouterOutlet, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonLabel, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon]
})
export class TabsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    addIcons({
       filmOutline,
       homeOutline,
      radioOutline,
      searchOutline,
      trendingUpOutline
    });
  }

}