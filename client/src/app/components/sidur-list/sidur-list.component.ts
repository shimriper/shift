import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import * as moment from 'moment';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

const doc = new jsPDF({
  orientation: "landscape",
});

@Component({
  selector: 'app-sidur-list',
  templateUrl: './sidur-list.component.html',
  styleUrls: ['./sidur-list.component.css']
})
export class SidurListComponent implements OnInit {

  // @ViewChild('htmlData') htmlData: ElementRef;
  // @ViewChild('content') content: ElementRef;
  title = 'html-to-pdf-angular-application';


  userIsAuthenticated;
  authListenerSubs;
  myUserRule;

  sunday;
  saturday;
  sidur;
  sidurData;
  userId;
  isUpdate: boolean = false;
  noData: boolean = true;
  closeResult: string;
  sidurs = [];
  userName;

  days = [];

  constructor(
    public weekService: WeekService,
    public authService: AuthService,
  ) {
  }

  public weekArray = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];

  getWeek(next: number) {
    var sunday = moment().add(next, 'week').startOf('week').format();
    var saturday = moment().add(next, 'week').endOf('week').format();

    this.sunday = moment(sunday).format('DD.MM');
    this.saturday = moment(saturday).format('DD.MM');

    return {
      sunday: sunday,
      saturday: saturday
    }
  }

  getAllDaysWeek(sunday, saturday) {
    console.log(sunday);
    for (var i = 0; i < 6; i++) {
      this.days[i] = moment(sunday).add(i, 'days').format('DD.MM');
    }
  }

  getMySidurByDates(next) {
    var startDay = this.getWeek(next);
    // var sunday = moment().startOf('week').format();
    // var saturday = moment().endOf('week').format();

    var sunday = moment().add(next, 'week').startOf('week').format();
    var saturday = moment().add(next, 'week').endOf('week').format();

    this.weekService.getSidurByDate(sunday, saturday).subscribe(data => {
      var id = data[0]._id;
      this.sidurData = data[0].qubes;
      this.sidurData[11].push({ id: '11', name: '' });
      this.sunday = moment(data[0].start).format('DD.MM');
      this.saturday = moment(data[0].end).format('DD.MM');
      this.getAllDaysWeek(data[0].start, data[0].end);
    });
  }

  getAllSidurs() {
    this.weekService.getAllSidurs().subscribe((data: []) => {
      this.sidurs = data;
    })
  }

  updateQube(item) {
    this.isUpdate = true;
    // this.modalService.open(content);
  }

  showSidur(sidur, i) {
    var id = sidur._id;
    this.weekService.getSidurById(id).subscribe(data => {
      this.sidurData = data.qubes;
      this.sidurData[11].push({ id: '11', name: '' });
      this.sunday = moment(data.start).format('DD.MM');
      this.saturday = moment(data.end).format('DD.MM');
      this.getAllDaysWeek(data.start, data.end);
    })

  }

  getLastInsert() {
    this.weekService.getLastInsert().subscribe(data => {
      this.sidurData = data[0].qubes;
      this.sidurData[11].push({ id: '11', name: '' });
      this.sunday = moment(data[0].start).format('DD.MM');
      this.saturday = moment(data[0].end).format('DD.MM');
      this.getAllDaysWeek(data[0].start, data[0].end);
    })
  }

  // public convetToPDF() {
  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data).then(canvas => {
  //     // Few necessary setting options
  //     var imgWidth = 208;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png')
  //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
  //     pdf.save('new-file.pdf'); // Generated PDF
  //   });
  // }


  // generatePDF() {
  //   // doc.text(this.content.nativeElement, 1, 1);
  //   // doc.save("two-by-four.pdf");
  //   // doc.text("Hello world!", 10, 10);
  //   // doc.save("a4.pdf");

  //   // let doc = new jsPDF();
  //   // doc.addHTML(, function () {
  //   //   doc.save("obrz.pdf");
  //   // });
  // }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.myUserRule = this.authService.getMyRule();
    this.userName = this.authService.getUserId();
    // this.getMySidurByDates(0);
    this.getLastInsert();
    this.getAllSidurs();
  }
}
