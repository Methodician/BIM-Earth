import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { MapService } from '@services/map.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { AuthInfo } from '@models/auth-info';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'bim-boundary-post',
  templateUrl: './boundary-post.component.html',
  styleUrls: ['./boundary-post.component.scss']
})
export class BoundaryPostComponent implements OnInit, OnChanges {
  @Input() feature;
  @Output() closeMenuRequest = new EventEmitter<null>();
  @ViewChild('upload') uploadComponent;
  panelOpenState: boolean = false; // unused variable?
  isBoundaryPostOpen = false;
  posts: {}[] = [];
  featureSub: Subscription;
  creatingPost: boolean = false;
  postForm: FormGroup;
  fileURLs: string[];
  authInfo: AuthInfo = AuthService.UNKNOWN_USER;

  get zapId() {
    return this.feature ? this.feature.properties.zapId : ""
  }

  constructor(
    private mapSvc: MapService,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(info => this.authInfo = info);
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
    this.togglePostForm();
  }

  togglePostForm() {
    this.creatingPost = !this.creatingPost;
  }

  cancelPost() {
    this.togglePostForm();
    this.postForm.reset();
    this.uploadComponent.clearFiles();
  }

  postUnauthorized() {
    return this.postForm.invalid || !this.authInfo.$uid; 
  }

  closeMenu() {
    this.cancelPost();
    this.closeMenuRequest.emit();
  }
}