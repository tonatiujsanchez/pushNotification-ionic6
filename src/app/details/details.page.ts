import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  notification: OSNotificationPayload;
  
  constructor(
    private activateRoute: ActivatedRoute,
    private pushSvc: PushService
  ) { }

  ngOnInit() {
    const id = this.activateRoute.snapshot.paramMap.get('idNotification')
    this.notification = this.pushSvc.getPush( id ) 
  }

}
