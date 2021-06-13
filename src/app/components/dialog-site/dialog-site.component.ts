import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogSiteData } from 'src/app/models/dialogSiteData';

@Component({
  selector: 'madryntracker-dialog-site',
  templateUrl: './dialog-site.component.html',
  styleUrls: ['./dialog-site.component.css'],
})
export class DialogSiteComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogSiteData) {}

  ngOnInit(): void {}
}
