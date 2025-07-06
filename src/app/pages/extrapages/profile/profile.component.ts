import { Component } from '@angular/core';
import {UserProfileService} from "../../../core/services/user.service";
import {AuthenticationService} from "../../../core/services/auth.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

// profile component
export class ProfileComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  role: any;
  currentUser:any
  imageToShow: any;
  currentUserLocal: any;

  constructor(  private authService: AuthenticationService,
   private userService: UserProfileService,
               private sanitizer: DomSanitizer) {
 }
  ngOnInit(): void {

    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserLocal = JSON.parse(userJson);
    }
    console.log(this.currentUserLocal.scope)
    this.breadCrumbItems = [
      {label: 'Pages', active: true},
      {label: 'Profile Settings', active: true}
    ];
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Pages', active: true },
      { label: 'Profile', active: true }
    ];


    this.getImage()

    this.role=this.authService.currentUser()['scope']
    console.log(this.currentUser);

  }
  getImage() {
    this.userService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        console.log("&&&&&&&&&&&");
        console.log(this.currentUser.photoProfile);

        // Call getImage inside the subscribe block of getCurrentUser
        this.userService.getImage(this.currentUser.photoProfile).subscribe(data => {
          this.createImageFromBlob(data);
        }, error => {
          console.log(error);
        });
      },
      error => {
        console.error('Errorrrrrr:', error);
      }
    );
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  // follow button toggle
  Followbtn(ev: any) {
    ev.target.closest('button').classList.toggle('active')
  }
}
