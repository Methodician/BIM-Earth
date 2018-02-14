import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bim-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post;

  get postDate() {
    if (this.post.timestamp) return `${this.post.timestamp.getMonth()+1}/${this.post.timestamp.getDay()}/${this.post.timestamp.getYear() - 100} at ${this.post.timestamp.getHours()}:${this.post.timestamp.getMinutes()}`;
    else return "UNKNOWN"
  }

  get title() {
    return this.post.title;
  }

  get postBody() {
    return this.post.description;
  }

  get author() {
    return this.post.author;
  }

  constructor() { }

  ngOnInit() {
    console.log('post: ', this.post)
  }

}
