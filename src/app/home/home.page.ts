import { OnInit, Component, ApplicationRef, ViewChild } from '@angular/core';
// import { Component } from '@angular/core';
// import { ApplicationRef } from '@angular/core';
// import { ViewChild } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
import { IonList } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  @ViewChild(IonList) listaRegistros: IonList;

  mensajes: OSNotificationPayload[] = [];  
  
  get userId(){
    return this.pushSvc.userId;
  }

  constructor( 
    private pushSvc: PushService,
    private appRef: ApplicationRef,
    private router: Router ) {}

  async ngOnInit() {
    
    this.mensajes = await this.pushSvc.getMensajes();

    this.pushSvc.pushListener.subscribe(
      ( newNotification ) => {
        this.mensajes = [ newNotification, ...this.mensajes ];
        this.appRef.tick();
      }
    )
  }

  verPush( idRegistro ) {
    this.router.navigate(['/home/details', idRegistro]);
  }

  async ionViewWillEnter() {      
    this.mensajes = await this.pushSvc.getMensajes();
  }

  
  eliminarRegistro(registro:OSNotificationPayload) {

    this.pushSvc.eliminarRegistro( registro );
    this.mensajes = this.mensajes.filter( r => r.notificationID !== registro.notificationID )

    this.listaRegistros.closeSlidingItems();
  }



}
