import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
import { ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  mensajes: OSNotificationPayload[] = [];  

  constructor( 
    private pushSvc: PushService,
    private appRef: ApplicationRef ) {}

  ngOnInit(): void {
    this.pushSvc.pushListener.subscribe(
      ( newNotification ) => {
        this.mensajes = [ newNotification, ...this.mensajes ];
        this.appRef.tick();
      }
    )
  }

  async ionViewWillEnter() {  
    console.log('WillEnter cargar mensajes');
    
    this.mensajes = await this.pushSvc.getMensajes();
  }

  

}
