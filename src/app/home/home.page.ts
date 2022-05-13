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
  
  get userId(){
    return this.pushSvc.userId;
  }

  constructor( 
    private pushSvc: PushService,
    private appRef: ApplicationRef ) {}

  async ngOnInit() {
    
    this.mensajes = await this.pushSvc.getMensajes();

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
