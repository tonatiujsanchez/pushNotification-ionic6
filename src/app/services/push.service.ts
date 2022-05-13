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

  public userId: string;

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

    // Cargar registros del storage
    await this.loadRegistros();

    // Verificar que no la notificacion no exista
    const existPush = this.mensajes.find( mensaje => mensaje.notificationID === nuevoRegistro.notificationID )
    if( existPush ){ return }

    // Emitimos el evento para añadirla
    this.pushListener.emit( nuevoRegistro )
    // La agregamos al nuestro arreglo de mensajes del servicio 
    this.mensajes = [ nuevoRegistro, ...this.mensajes ];

    // Guardamos el estorage con los nuevos mensajes
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

    this.oneSignal.handleNotificationOpened().subscribe( async( resp ) => {
      // Notificación abierta

      console.log( 'Notificacion abierta', resp.notification );
      await this.notificationReceived( resp.notification )
    });

    // Obtener el ID del usuario para porder enviarle notificaciones personaliadas
    this.oneSignal.getIds().then( info => {
      this.userId = info.userId;
    })


    this.oneSignal.endInit();
  }


  async notificationReceived( notification: OSNotification ) {
    const payload = notification.payload

    await this.agregarNuevoRegistro( payload )
    console.log( this.mensajes );
    
  }


}
