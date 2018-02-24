import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { MapService } from '@services/map.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { AuthInfo } from '@models/auth-info';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatDialog } from '@angular/material';
import { LightboxDialogComponent } from '@components/lightbox-dialog/lightbox-dialog.component';
// import {  } from '@angular/core/src/linker/view_container_ref';

@Component({
  selector: 'bim-boundary-post',
  templateUrl: './boundary-post.component.html',
  styleUrls: ['./boundary-post.component.scss']
})
export class BoundaryPostComponent implements OnInit, OnChanges {
  @Input() feature;
  @Output() closeMenuRequest = new EventEmitter<null>();
  @Output() saveEditRequest = new EventEmitter<null>();
  @Output() editFeatureRequest = new EventEmitter<null>();
  @Output() cancelEditRequest = new EventEmitter<null>();
  @ViewChild('upload') uploadComponent;
  panelOpenState: boolean = false; // unused variable?
  isBoundaryPostOpen = false;
  posts: {}[] = [];
  featureSub: Subscription;
  creatingPost: boolean = false;
  editingBoundary: boolean = false;
  postForm: FormGroup;
  fileURLs: string[];
  authInfo: AuthInfo = AuthService.UNKNOWN_USER;
  userInfo = null;

  get zapId() {
    return this.feature ? this.feature.properties.zapId : ""
  }

  constructor(
    private mapSvc: MapService,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private firestore: AngularFirestore,
    private lightbox: MatDialog,
    private viewContainerRef: ViewContainerRef,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(info => this.authInfo = info);
    this.authSvc.getUserInfo().valueChanges().subscribe(info => { this.userInfo = info });
    this.postForm = this.fb.group({
      title: ["", Validators.required],
      description: ""
    });
  }

  ngOnChanges(changes) {
    if(changes.feature.currentValue){
      if(this.featureSub) this.featureSub.unsubscribe();
      this.featureSub = this.mapSvc
        .getBoundaryPosts(this.feature.properties.id)
        .valueChanges()
        .subscribe(posts => {
          this.posts = posts;
        })
    }
  }

  // closes component, handles cleanup based on component state
  closeBoundaryMenu() {
    if(this.editingBoundary) {
      this.cancelEdit()
    } else if(this.creatingPost) {
      this.resetPostForm();
    }
    this.closeMenuRequest.emit();
  }

  showPostForm() {
    this.creatingPost = true;
  }

  savePost(uploadData) {
    let formData = this.postForm.value; 
    let post = {
      title: formData.title,
      description: formData.description,
      author: this.authInfo.$uid,
      featureId: this.feature.properties.id,
      id: this.firestore.createId(),
      images: ["processing"],
      files: ["processing"]
    }
    this.mapSvc.savePost(post);
    this.uploadComponent.startUpload(this.feature.properties.id, post.id);
    this.resetPostForm();
  }

  resetPostForm() {
    this.creatingPost = false;
    this.postForm.reset();
    this.uploadComponent.clearFiles();
  }

  postUnauthorized() {
    return this.postForm.invalid || !this.authInfo.$uid; 
  }

  // boundary edit methods
  editBoundary() {
    this.editFeatureRequest.emit();
    this.toggleEditBoundary();
  }

  saveEdit() {
    this.saveEditRequest.emit();
    this.toggleEditBoundary();
  }

  cancelEdit() {
    this.cancelEditRequest.emit();
    this.toggleEditBoundary();
  }
  
  toggleEditBoundary() {
    this.editingBoundary = !this.editingBoundary;
  }

  // image lightbox
  openLightbox(photoURL) {
    // let ref = this.viewContainerRef;
    //if this is the correct reference, follow the material docs example to attach it to the tree then try and find a way to see the whole tree
    // debugger;
    const dialogRef = this.lightbox.open(LightboxDialogComponent, {
      data: { photoURL: photoURL },
      autoFocus: false,
      panelClass: "lightbox",
      viewContainerRef: this.viewContainerRef
    });
    //pass in view container ref
    //trigger change detection request from here I guess, once the component is loaded(opened),
    // add on change or whatever lifecycle hook shows view checked (probably viewChecked) and see if I can get the component to re-render once it's loaded
    // on image click in the post component, add timeout to allow to verify the image hasn't loaded then emit request to view check this boundary post
    // i know that running ref.detectChanges in this component will view check the dialog
    // i need to manually account for the individual unresponsive behaviors, and call view check on them.
    
    // add timeout to image click to verify
    // if that works add view check to close click, (which needs verification of internal view check functioning)
    // add view check to dialogRef.backdropClick() 
    dialogRef
      .backdropClick()
      .subscribe(event => {
        console.log('dialog backdrop clicked: ', event)
        this.ref.detectChanges();
        dialogRef.close()
      })
    dialogRef
      .afterOpen()
      .subscribe(_ => {
        console.log('dialog afterOpen triggered')
        window.setTimeout(_ => {
          console.log('timeout complete (scope check): ', this.authInfo.displayName);
          this.ref.detectChanges();
        }, 2500)
        this.ref.detectChanges()
      });
    dialogRef
      .beforeClose()
      .subscribe(_ => {
        console.log('dialog beforeClose requested')
        if (dialogRef.componentInstance.downloaded) {
          // this block is executed if the file was downloaded in the lightbox
        }
      });
  }

  checkView() {
    console.log('manual check view called')
    this.ref.detectChanges();
  }
}