import { Injectable } from '@angular/core';
import { OneSignal, OSNotification } from '@awesome-cordova-plugins/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {


  mensajes: any[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el body',
    //   date: new Date()
    // }
  ];


  constructor(private oneSignal: OneSignal) { }


  configInit() {
    this.oneSignal.startInit('5b5c0921-2da2-4a83-837e-2195356a0171', '30358174004');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe(( notification ) => {
      // Notificación recibida

      console.log('Notificacion recibida', notification);
      this.notificationReceived( notification )
      
    });

    this.oneSignal.handleNotificationOpened().subscribe(( resp ) => {
      // Notificación abierta

      console.log( 'Notificacion abierta', resp );
      
    });

    this.oneSignal.endInit();
  }


  notificationReceived( notification: OSNotification ) {
    const payload = notification.payload

    const existPush = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID )

    if( existPush ){ return }

    this.mensajes.unshift( payload )

    console.log( this.mensajes );
    
  }


}
