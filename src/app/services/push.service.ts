import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private _storage: Storage | null = null;
  private keyStorage = '1652387572547-pushApp'

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el body',
    //   date: new Date()
    // }
  ];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private oneSignal: OneSignal,
    private storage: Storage
    ){
      this.loadRegistros();
     }

    
  async getMensajes() {
    await this.loadRegistros;
    return [...this.mensajes];
  }

  async loadRegistros() {
    const storage = await this.storage.create();
    this._storage = storage;

    return await this.cargarRegistros();
  }

  async cargarRegistros(){
    const resgitrosStorage:OSNotificationPayload[] = await this._storage.get(this.keyStorage);

    if( !resgitrosStorage ){
      this._storage.set( this.keyStorage, [] );
    }

    this.mensajes = resgitrosStorage || [];

    return this.mensajes;

  }


  async agregarNuevoRegistro( nuevoRegistro ){

    await this.loadRegistros();

    this.mensajes = [ nuevoRegistro, ...this.mensajes ];

    this.guardarStorage();
  }

  guardarStorage(){
    this._storage.set( this.keyStorage, this.mensajes );
  }

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

    this.pushListener.emit( payload )
    this.agregarNuevoRegistro( payload )
    console.log( this.mensajes );
    
  }


}
