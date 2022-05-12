import { Component, OnInit } from '@angular/core';
import { PushService } from './services/push.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor( 
    private pushSvc: PushService
  ) {

  }

  ngOnInit(): void {
    this.pushSvc.configInit();
  }

  
}
