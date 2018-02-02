import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'bim-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {
  @Input() userKey;
  src: string = "http://fillmurray.com/300/300";
  
  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    // this.authSvc.getUserPicture(userKey).subscribe(src => {
    //   this.src = src;
    // })
  }

}
